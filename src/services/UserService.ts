import * as dotenv from 'dotenv';
import { Request } from 'express';
import { decrypt, encrypt, getDay, hashMD5 } from '../helpers/helpers';
import jwt from "jsonwebtoken"
import { UserModel } from '../models/User';

dotenv.config();

class UserService {

    public async userSignUp(req: Request) {
        const { name, lastName, email, password } = req.body;
        if (! await this.validateUser(email)) {
            const result = await UserModel.create({
                id: hashMD5(`${name}${getDay()}`),
                name: name,
                last_name: lastName,
                email: email,
                password: encrypt(password),
                balance: 20000,
                create_date: getDay(),
                update_date: getDay(),
            });

            return { status: true, message: "USER_CREATED", data: result }
        } else {

            return { status: false, message: "USER_EXISTS" }
        }
    }


    public async userSignIn(req: Request) {
        const { email, password } = req.body;
        let dataUser = await UserModel.scan("email").eq(email).exec();
        if (dataUser.count != 0) {
            if (decrypt(dataUser[0].password) == password) {
                const token = jwt.sign({ id: dataUser[0].id, email: dataUser[0].email, balance: dataUser[0].balance },
                    process.env.SECRET ? process.env.SECRET : "", { expiresIn: 86400 })

                return {
                    status: true, message: "SIGN_IN_SUCCESS",
                    data: { token: token, name: dataUser[0].name, balance: dataUser[0].balance }
                };
            } else {

                return { status: false, message: "PASSWORD_INVALID" }
            }
        } else {

            return { status: false, message: "EMAIL_INVALID" }
        }
    }

    private async validateUser(email: string) {
        let dataUser = await UserModel.scan("email").eq(email).exec();

        return dataUser.length > 0 ? true : false;
    }

}
export default UserService;