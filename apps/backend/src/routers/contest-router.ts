import { Router } from "express";
import { prisma } from '@repo/db/client'

import type { CustomRequest } from "../types/types.js";
import { ContestDataSchema } from '@repo/zod'


export const contestRouter : Router = Router();


contestRouter.post("/create",async (req:CustomRequest,res)=>{
    const problemMetadata = req.body;

    const safeParsedData = ContestDataSchema.safeParse(problemMetadata)
    if(!safeParsedData.success){
        return res.status(401).json({
            msg: "Wrong inputs"
        })
    }

    const problemData = safeParsedData.data;
    const userId = req.id;

    const response = await prisma.contest.create({
        data:{
            createdBy:userId!,
            problems:{
                create: problemData.map((pd,index)=>{
                    return {
                        title: pd.title,
                        description: pd.description,
                        problemNumber: index+1,
                        testcases:{
                            create: pd.testcases.map((ts,idx)=>{
                                return {
                                    testCase: ts.testCase,
                                    result: ts.result,
                                    order: idx+1
                                }
                            })
                        }
                    }
                })
            }
        },
        select:{
            id:true
        }
    })

    res.json({
        contestId: response.id,
        msg: "Contest_created"
    })
})

contestRouter.post("/join",async(req:CustomRequest,res)=>{
    const {contestId} = req.body;
    const userId = req.id;

    await prisma.contest.update({
        where:{
            id:contestId
        },
        data:{
            participatedUsers:{
                connect:{
                    id:userId
                }
            }
        }
    })

    res.json({
        msg: "Contest joined"
    })
})

contestRouter.post("/exit",async(req:CustomRequest,res)=>{
    const { contestId } = req.body;
    const userId = req.id;

    await prisma.contest.update({
        where:{
            id:contestId
        },
        data:{
            participatedUsers:{
                disconnect:{
                    id:userId
                }
            }
        }
    })

    res.json({
        msg: "Contest exited"
    })
})

contestRouter.get("/get-problems/:contestId",async(req,res)=>{
    const { contestId } = req.params;

    const problems = await prisma.contest.findFirst({
        where:{
            id: contestId
        },
        select:{
            problems:{
                select:{
                    id:true
                }
            }
        }
    })

    res.json(problems?.problems)
})

contestRouter.get("/problems/:problemId",async(req:CustomRequest,res)=>{
    const { problemId } = req.params;

    const problem = await prisma.problem.findFirst({
        where:{
            id: problemId
        },
        select:{
            title: true,
            description: true
        }
    })

    res.json(problem);
})

contestRouter.get("/result/:contestId",async(req:CustomRequest,res)=>{
    const contestId = req.params.contestId;

    const response = await prisma.contest.findFirst({
        where:{
            id:contestId
        },
        include:{
            problems:true
        }
    })

    if(!response){
        return res.json({
            msg: "Invalid contest ID "
        })
    }
    if(response.isCompleted==="NotCompleted"){
        return res.json({
            msg: "Contest is still under progress"
        })
    }

    const winnerId = response.winner;
    const winnerName = await prisma.user.findFirst({
        where:{
            id:winnerId!
        },
        select:{
            name:true,
            username:true
        }
    })

    res.json(winnerName);
})