import { Router } from "express";
import bodyParser from 'body-parser'
import { signIn, signUp } from "../controllers/UserController/UserController";
import { closeRolette, createRolette, getRolettes } from "../controllers/RoletteController/RoletteController";
import { createBets } from "../controllers/BetsController/BetsController";
const jsonParser = bodyParser.json()

const router = Router()

//User auth
router.post('/user/signUp', jsonParser, signUp);
router.post('/user/signIn', jsonParser, signIn);

//manteiner rolette
router.post('/rolette/create', jsonParser, createRolette);
router.get('/rolette/list', jsonParser, getRolettes);
router.post('/rolette/closing', jsonParser, closeRolette);

//bets
router.post('/bets/create', jsonParser, createBets);


export default router;