import type { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken'
import type { CustomRequest } from "../types/types.js";


export function middleware(req:CustomRequest,res:Response,next:NextFunction){
    const tokenData = req.headers.authorization;
    if(!tokenData)return res.status(403).json({msg: "Unauthorized"});

    const token = tokenData?.split(" ")[1];
    if(!token)return res.status(403).json({msg: "Unauthorized"});
    
    const data = jwt.verify(token,"secret") as {id:number};
    req.id = data.id;
    next();
}