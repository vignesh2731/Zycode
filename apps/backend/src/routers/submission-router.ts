import { Router } from "express";
import { createClient } from "redis";


import type { CustomRequest } from "../types/types.js";
import { SubmissionDataSchema } from "@repo/zod";

export const submissionRouter:Router = Router();

const redis = createClient({url:'redis://localhost:6379'});
async function connect(){
    await redis.connect();
}
connect();

submissionRouter.post("/submit",async(req:CustomRequest,res)=>{
    const safeParsedData = SubmissionDataSchema.safeParse(req.body);

    if(!safeParsedData.success){
        return res.status(401).json({
            msg: "Wrong inputs"
        })
    }

    const {problemId,contestId,code,language} = safeParsedData.data;
    const userId = req.id;
    await redis.rPush?.("submissions",JSON.stringify({problemId,contestId,code,userId,language}))
    
    res.json({
        msg: "Code submitted"
    })
})