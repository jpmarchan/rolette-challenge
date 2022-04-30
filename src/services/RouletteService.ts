import * as dotenv from 'dotenv';
import { Condition } from 'dynamoose';
import { Request } from 'express';
import { generateRange, getDay, hashMD5 } from '../helpers/helpers';
import { RouletteModel } from '../models/Roulette';
import { UserModel } from '../models/User';

dotenv.config();

export default class RouletteService {

    public async createRolette(req: Request) {//create new rolettes
        const { name, numbersToBetRange, colorsToBet, maximumMoney } = req.body;
        if (numbersToBetRange.initial > numbersToBetRange.finish) { return { status: false, message: "RANGE_INVALID" } }//validate values in range
        if (colorsToBet.length < 2) { return { status: false, message: "MINIMUN_TWO_COLORS" } }//validate what existing tow colors
        const result = await RouletteModel.create({
            id: hashMD5(`${name}${getDay()}`),
            name: name,
            numbers_to_bet: generateRange(numbersToBetRange),//generate ranges
            colors_to_bet: colorsToBet,
            maximum_money: maximumMoney,
            status_roulette: "open",
            bets: [],
            create_date: getDay(),
            update_date: getDay(),
        });
        let response: any = {
            status: result.id ? true : false,
            message: result.id ? "RULETTE_CREATED" : "RULETTE_CREATED_FAILED",
            data: result.id ? { id: result.id, numbers_to_bet: result.numbers_to_bet } : {}
        }

        return response
    }

    public async getRolettes() {//list all rolettes
        let dataRoulete = await RouletteModel.scan().exec();

        return {
            status: true,
            message: "lIST_RULETTES_SUCCESS",
            data: dataRoulete
        }
    }

    public async closeRolette(req: Request) {
        const { id } = req.body;
        let roletteData = await RouletteModel.query("id").eq(id).exec();
        let indexRandomNumber = Math.floor(Math.random() * roletteData[0].numbers_to_bet.length);//find index random in number
        let indexRandomColor = Math.floor(Math.random() * roletteData[0].colors_to_bet.length);//find index random in color
        let randomNumber = roletteData[0].numbers_to_bet[indexRandomNumber]
        let randomColor = roletteData[0].colors_to_bet[indexRandomColor]
        let arrayBetsUpdate = []
        let count =0
        for (const bet of roletteData[0].bets) {
            count = count +1
            let userData = await UserModel.query("id").eq(bet.idUser).exec();
            if (bet.numbersOrColorsToBet === randomNumber && bet.statusRolete == "open") {
                bet.moneyBetClose = (bet.moneyBet * 5)
                bet.status = "winner"
                arrayBetsUpdate.push(await bet)
                await this.updateBalancesUser({ idUser: bet.idUser, newBalance: (bet.moneyBet * 5), balance: userData[0].balance, status: "winner" })
            }
            if (bet.numbersOrColorsToBet === randomColor && bet.statusRolete == "open") {
                bet.moneyBetClose = (bet.moneyBet * 1.8)
                bet.status = "winner"
                arrayBetsUpdate.push(await bet)
                await this.updateBalancesUser({ idUser: bet.idUser, newBalance: (bet.moneyBet * 1.8), balance: userData[0].balance, status: "winner" })
            }
                bet.moneyBetClose = 0
                bet.status = "loser"
                arrayBetsUpdate.push(await bet)
                await this.updateBalancesUser({ idUser: bet.idUser, newBalance: bet.moneyBet, balance: userData[0].balance, status: "loser" })
        }
        await this.updateStatusRolette({ id: id, randomNumber: randomNumber, randomColor: randomColor, newBets:arrayBetsUpdate})
        let result = await RouletteModel.query("id").eq(id).exec();

        return { status: true, message: "CLOSE_ROLETTE" ,data: result[0]}
    }

    private async updateBalancesUser(betsUser: any) {
        let newBalance = 0
        betsUser.status === "winner" ? newBalance = betsUser.balance + betsUser.newBalance :
            newBalance = betsUser.balance - betsUser.newBalance

        const result = await UserModel.update(
            { id: betsUser.idUser },
            { balance: newBalance },
            { condition: new Condition().filter('id').exists() },
        );
        return result
    }

    private async updateStatusRolette(updateStatus: any) {
        await RouletteModel.update(
            { id: updateStatus.id },
            { status_roulette: "close" },
            { condition: new Condition().filter('id').exists() },
        );
        await RouletteModel.update(
            { id: updateStatus.id },
            { winning_numerical_result:  updateStatus.randomNumber},
            { condition: new Condition().filter('id').exists() },
        );
        await RouletteModel.update(
            { id: updateStatus.id },
            { bets:  updateStatus.newBets},
            { condition: new Condition().filter('id').exists() },
        );
        await RouletteModel.update(
            { id: updateStatus.id },
            { winning_color_result:  updateStatus.randomColor},
            { condition: new Condition().filter('id').exists() },
        );
        let response = await RouletteModel.update(
            { id: updateStatus.id },
            { closing_date: getDay() },
            { condition: new Condition().filter('id').exists() },
        )
        return response
    }




}
