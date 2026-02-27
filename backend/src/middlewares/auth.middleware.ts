import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['token'];
    if (!token) {
      throw new Error('Token not found');
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = user;
    next();  
  } catch (error) {
    console.log("Error authenticating auth token", error);
    next(error);
  }
}