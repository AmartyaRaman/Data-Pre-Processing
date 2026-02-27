import { Request, Response, NextFunction } from "express";

interface fileReq extends Request {
  file?: any;
}

export const processFile = async (req: fileReq, res: Response, next: NextFunction) => {
    try {
      console.log(req.file);
      res.status(202).send("File processed successfully");
    } catch (error) {
      console.log("Error in processFile controller");
      next(error);
    }
}