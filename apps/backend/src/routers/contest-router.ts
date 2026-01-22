import { Router } from "express";
import { prisma } from '@repo/db/client'

import type { CustomRequest } from "../types/types.js";
import { ContestDataSchema } from '@repo/zod'
import { middleware } from "../middleware/middlware.js";


export const contestRouter : Router = Router();
contestRouter.use(middleware);

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

    await prisma.contest.update({
        where:{
            id:response.id
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
        contestId: response.id,
        msg: "Contest_created"
    })
})

contestRouter.post("/join",async(req:CustomRequest,res)=>{
    const {contestId} = req.body;
    const userId = req.id;
    const data = await prisma.contest.findFirst({
        where:{
            id: contestId
        },
        select:{
            id:true
        }
    })
    if(!data){
        return res.json({msg: "Contest Not found"});
    }
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
        msg: "Contest joined",
        id:data.id
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

contestRouter.get("/problems/:contestId/:problemNumber",async(req:CustomRequest,res)=>{
    const { contestId, problemNumber } = req.params;
    const problem = await prisma.problem.findFirst({
        where:{
            problemNumber: Number(problemNumber),
            contestId: contestId
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
        return res.status(403).json({
            msg: "Invalid contest ID "
        })
    }
    if(response.isCompleted==="NotCompleted"){
        return res.json({
            msg: "Contest is still under progress"
        })
    }

    const winnerId = response.winner;
    const data = await prisma.user.findFirst({
        where:{
            id:winnerId!
        },
        select:{
            name:true,
            username:true
        }
    })

    res.json({name:data?.name});
})

contestRouter.get("/pariticipants/:contestId",async(req,res)=>{
    const { contestId } = req.params;
    const data = await prisma.contest.findFirst({
        where:{
            id:contestId
        },
        select:{
            participatedUsers:{
                select:{
                    name: true 
                }
            }
        }
    })
    const names = data?.participatedUsers.map((d)=>d.name);
    res.json({
        names
    })  
})

contestRouter.get("/maker/:contestId",async(req,res)=>{
    const { contestId } = req.params;
    const data = await prisma.contest.findFirst({
        where:{
            id: contestId
        },
        select:{
            createdBy:true
        }
    })
    res.json({
        maker: data?.createdBy
    })
})