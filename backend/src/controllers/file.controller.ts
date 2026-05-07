import { Request, Response, NextFunction } from "express";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

interface fileReq extends Request {
  file?: any;
}

export const uploadFile = async (req: fileReq, res: Response, next: NextFunction) => {
    try {
      console.log(req.file);
      res.status(202).send("File uploaded successfully");
    } catch (error) {
      console.log("Error in uploadFile controller");
      next(error);
    }
}

export const processFile = async (req: fileReq, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if(!file) {
      return res.status(400).send("No file uploaded");
    }

    // Call the data-service api with the file uploaded in upload folder in the root of backend
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const response = await axios.post('http://localhost:8000/data-service/process', formData, { 
      headers: formData.getHeaders(), // auto-sets multipart/form-data with correct boundary
    })

    res.status(200).json({
      message: "File processed successfully",
      data: response.data
    })

    
  } catch (error) {
      console.log("Error in processFile controller");
      next(error);
  }
}