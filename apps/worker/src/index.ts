import { createClient } from 'redis'
import { prisma } from '@repo/db/client'
import type { SubmissionDataType, SubmissionStatusType } from '@repo/zod/types'
import dotenv from 'dotenv'
import axios from 'axios';

dotenv.config();
type ParsedDataType = SubmissionDataType & {userId : number};
enum Language {
    CPP = 52,    
    JAVA = 62,   
    PYTHON = 71  
}
const JUDGE0_URL = process.env.JUDGE0_URL;
async function main(){
    const redis = createClient({url: "redis://localhost:6379"});
    await redis.connect();
    const socket = new WebSocket("ws://localhost:8080");

    // Wait for WebSocket to open before processing submissions
    await new Promise<void>((resolve, reject) => {
        socket.onopen = () => {
            resolve();
        };
        socket.onerror = (error) => {
            console.error("Worker WebSocket error:", error);
            reject(error);
        };
    });

    while(1){
        const response = await redis.lPop("submissions");
        if (!response) {
            await new Promise(r => setTimeout(r, 50));
            continue;
        }
        const parsedData = JSON.parse(response) as ParsedDataType;
        const { problemId, userId, contestId, code,language} = parsedData;
        const [data,solver,totalProblems] = await Promise.all([prisma.testCase.findMany({
                where:{
                    problem:{
                        problemNumber:Number(problemId),
                        contestId: parsedData.contestId
                    },
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
        ])
        if(!data)continue;
        const result = data.map(d=>d.result);
        const testcases = data.map(d=>d.testCase);
        const ans = await func(code,language,testcases,result);
        let winner: undefined | string;
        let accepted = ans,ended = false;

        if(accepted){
            await prisma.problem.updateMany({
                where:{
                    problemNumber: Number(problemId),
                    contestId:contestId
                },
                data:{
                    completedBy:userId
                }
            })
            
            if(Number(problemId)===totalProblems?._count.problems){
                const userMap = new Map<number, number>();

                const completedUsers = await prisma.problem.findMany({
                    where: { contestId },
                    select: { completedBy: true }
                });
                if (completedUsers.length === 0) return;

                for (const p of completedUsers) {
                    if (p.completedBy !== null) {
                        userMap.set(p.completedBy, (userMap.get(p.completedBy) ?? 0) + 1);
                    }
                }
                let maxSolved = -1;
                let winnerId: number | null = null;

                for (const [userId, solved] of userMap) {
                if (solved > maxSolved) {
                    maxSolved = solved;
                    winnerId = userId;
                }
                }

                if (winnerId === null) {
                console.warn("Winner could not be determined");
                return;
                }
                let [contestData,user] = await Promise.all([prisma.contest.update({
                    where:{
                        id:contestId
                    },
                    data:{
                        winner: winnerId,
                        isCompleted: 'Completed'
                    }
                }),
                    prisma.user.findFirst({
                        where:{
                            id: winnerId
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
        
        if(socket.readyState === WebSocket.OPEN){
            socket.send(JSON.stringify(dataToBeSent));
        } else {
            console.error("Worker WebSocket not open, readyState:", socket.readyState);
        }
    }
}

function getLanguageId(language: string): number {
    switch (language.trim()) {
      case "C++":
        return Language.CPP;
      case "Java":
        return Language.JAVA;
      case "Python":
        return Language.PYTHON;
      default:
        throw new Error(`Invalid language: "${language}"`);
    }
  }
  

  async function func(
    code: string,
    language: string,
    testcases: string[],
    expected: string[]
  ): Promise<boolean> {
  
    const languageId = getLanguageId(language);
  
    const cleanCode = code
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .trim();
  
    const normalize = (s: string) =>
      s.replace(/\r\n/g, "\n").replace(/\s+$/g, "").trim();
  
    for (let i = 0; i < testcases.length; i++) {
  
      if (!expected[i] || expected[i]!.trim() === "") {
        console.error("Empty expected output at testcase", i);
        return false;
      }
  
      const res = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: cleanCode,
          language_id: languageId,
          stdin: testcases[i]
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10_000
        }
      );
  
      const sub = res.data;
      if (sub.compile_output || sub.stderr || sub.status?.id !== 3) {
        return false;
      }
  
      const stdout = sub.stdout;
      if (normalize(stdout) !== normalize(expected[i]!)) {
        return false;
      }
    }
  
    return true;
  }


main();