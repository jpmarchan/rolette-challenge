import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import jwt from "jsonwebtoken"

dotenv.config();

export const verifyToken = async (req: any, res: any, next: NextFunction): Promise<void> => {
    let token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "No token provided" });
  
    try {
      const decoded : any = jwt.verify(token, process.env.SECRET ? process.env.SECRET : "");
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
};

