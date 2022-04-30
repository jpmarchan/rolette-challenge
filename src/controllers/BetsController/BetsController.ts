import { Request, Response } from 'express';
import BetsService from '../../services/BetsService';
const betsServices = new BetsService();


export async function createBets(req: Request, res: Response) {
    try {
        let result = await betsServices.createBets(req)

        res.json(result);
    } catch (error) {

        res.json(error);
    }
}








