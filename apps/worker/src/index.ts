import { createClient } from 'redis'
import { prisma } from '@repo/db/client'
import type { SubmissionDataType, SubmissionStatusType } from '@repo/zod/types'


type ParsedDataType = SubmissionDataType & {userId : number};


async function main(){
    const redis = createClient({url: "redis://localhost:6379"});
    await redis.connect();
    const socket = new WebSocket("ws://localhost:8080");


    while(1){
        const response = await redis.lPop("submissions");
        if(!response)continue;

        const parsedData = JSON.parse(response) as ParsedDataType;
        console.log(parsedData);

        const { problemId, userId, contestId, code,language} = parsedData;
        const [data,solver,totalProblems,problemMetadata] = await Promise.all([prisma.testCase.findMany({
                where:{
                    problemId:problemId
                },
                orderBy:{
                    order: 'asc'
                },
                select:{
                    result:true,
                    testCase:true,
                }
            }),
            prisma.user.findFirst({
                where:{
                    id:userId
                },
                select:{
                    username:true
                }
            }),
            prisma.contest.findFirst({
                where:{
                    id:contestId
                },
                select:{
                    _count:{
                        select:{
                            problems:true
                        }
                    },
                }
            }),
            prisma.problem.findFirst({
                where:{
                    id:problemId
                },
                select:{
                    problemNumber:true
                }
            })
        ])
        if(!data)continue;


        const result = data.map(d=>d.result);
        const testcases = data.map(d=>d.testCase);
        const ans = func(code,testcases);
        let winner: undefined | string;
        let accepted = true,ended = false;
        // Call to the code executor goes from here

        if(accepted){
            await prisma.problem.update({
                where:{
                    id:problemId
                },
                data:{
                    completedBy:userId
                }
            })
            if(problemMetadata?.problemNumber===totalProblems?._count.problems){
                const userMap = new Map<number,number>()
                const completedUsers = await prisma.problem.findMany({
                    where:{
                        contestId:contestId
                    },
                    select:{
                        completedBy:true
                    }
                })
                if(!completedUsers){}
                for(const user of completedUsers)
                {
                    if(user.completedBy!==null)userMap.set(user.completedBy,(userMap.get(user.completedBy) || 0)+1)
                }
                let maxi = 0, res = -1;
                for(const [user,freq] of userMap){
                    if(maxi<freq){
                        maxi = freq;
                        res = user;
                    }
                }
                let [contestData,user] = await Promise.all([prisma.contest.update({
                    where:{
                        id:contestId
                    },
                    data:{
                        winner: res,
                        isCompleted: 'Completed'
                    }
                }),
                    prisma.user.findFirst({
                        where:{
                            id: res
                        },
                        select:{
                            username:true
                        }
                    })
                ])
                ended = true;
                winner = user?.username;
            }
        }
        const dataToBeSent : SubmissionStatusType = {
            contestId,
            problemId,
            userId,
            type: "submission_status",
            accepted,
            name: solver?.username,
            ended,
            winner
        }
        socket.send(JSON.stringify(dataToBeSent));
    }
}


function func(code:string,testcase:string[]){
    return [];
}


main();