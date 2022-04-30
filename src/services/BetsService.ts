import * as dotenv from 'dotenv';
import { Condition } from 'dynamoose';
import { Request } from 'express';
import { RouletteModel } from '../models/Roulette';
import jwt from "jsonwebtoken"
import { UserModel } from '../models/User';
dotenv.config();

export default class BetsService {

    public async createBets(req: Request) {
        const { numbersOrColorsToBet, moneyBet, idRolette } = req.body;
        const token = req.header("Token");
        const decoded: any = jwt.verify(token ? token : "", process.env.SECRET ? process.env.SECRET : "");
        let roletteData = await RouletteModel.query("id").eq(idRolette).exec();
        let userData = await UserModel.query("id").eq(decoded.id).exec();
        let validateBalances = this.validateBalances({balanceBets: roletteData[0].bets, idUser: decoded.id })
        if (userData.count == 0) {

            return { status: false, message: "TOKEN_INVALID" }
        }
        if (userData[0].balance < moneyBet || userData[0].balance <= validateBalances) {

            return { status: false, message: "INSUFFICIENT_BALANCE" }
        }
        if (roletteData.count != 0) {
            roletteData[0].bets.push({
                numbersOrColorsToBet: numbersOrColorsToBet,
                moneyBet: moneyBet, idUser: decoded.id,
                statusRolete:roletteData[0].status_roulette 
            })
            await RouletteModel.update(
                { id: idRolette },
                { bets: roletteData[0].bets },
                { condition: new Condition().filter('id').exists() },
            );
        }

        return { status: roletteData.count != 0 ? true : false, message: roletteData.count != 0 ? "BETS_SUCCESS" : "BETS_FAILED" }
    }
    

    private validateBalances(betsUser: any) {
        let sumBalancesByUser = 0
        betsUser.balanceBets.filter((bet: any) => bet.idUser == betsUser.idUser).forEach((bet: any) => {
            sumBalancesByUser = sumBalancesByUser + bet.moneyBet
        });
        return sumBalancesByUser
    }
}
