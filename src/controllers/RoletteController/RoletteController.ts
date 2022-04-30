import { Request, Response } from 'express';
import RouletteService from '../../services/RouletteService';
const roletteServices = new RouletteService();


export async function createRolette(req: Request, res: Response) {

    try {
        let result = await roletteServices.createRolette(req)

        res.json(result);
    } catch (error) {

        res.json(error);
    }
}

export async function getRolettes(req: Request, res: Response) {
    try {
        let result = await roletteServices.getRolettes()

        res.json(result);
    } catch (error) {

        res.json(error);
    }
}

export async function closeRolette(req: Request, res: Response) {
    try {
        let result = await roletteServices.closeRolette(req)

        res.json(result);
    } catch (error) {

        res.json(error);
    }
}


