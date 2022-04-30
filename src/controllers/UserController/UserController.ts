import { Request, Response } from 'express';
import UserService from '../../services/UserService';
const userServices = new UserService();


export async function signUp(req: Request, res: Response) {

    try {
        let result = await userServices.userSignUp(req)
        res.json(result);
    } catch (error) {
        res.json(error);
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        let result = await userServices.userSignIn(req)
        res.json(result);
    } catch (error) {
        res.json(error);
    }
}



//service 





