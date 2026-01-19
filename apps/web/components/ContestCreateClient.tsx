"use client"
import { useRef, useState } from "react";
import { Card } from "./Card";
import { Question } from "./Question";
import { QuestionDetails } from "@/types/types";
import { Button } from "./Button";
import { ContestDataSchema } from '@repo/zod'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ContestCreateClient(){
    const[noOfQuestions,setNoOfQuestions] = useState<number>(1);
    const [questions,setQuestions] = useState<QuestionDetails[]>([]);
    const titleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const descriptionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const testcaseTimeout = useRef<ReturnType<typeof setTimeout>| null>(null);
    const resultTimeout = useRef<ReturnType<typeof setTimeout>| null>(null);
    const router = useRouter();
    const session = useSession();
    const userId = session?.data?.user.id;

    function addResult(value:string,problemNo:number,testCaseNo:number){
        if(resultTimeout.current){
            clearTimeout(resultTimeout.current);
        }
        resultTimeout.current = setTimeout(()=>{
            const updated = [...questions];
            const testcases = [...updated[problemNo]?.testcase ?? []];
            testcases[testCaseNo] = {...(testcases[testCaseNo] ?? {testcase:'',result: ''}),result:value};
            updated[problemNo] = { ...updated[problemNo]!,testcase: testcases};
            setQuestions(updated);
            // console.log(updated);
        },1000)
    }

    function addTestCase(value:string,problemNo:number,testCaseNo:number){
        if(testcaseTimeout.current){
            clearTimeout(testcaseTimeout.current);
        }
        testcaseTimeout.current = setTimeout(()=>{
            const updated = [...questions];
            const testcases = [...updated[problemNo]?.testcase ?? []];
            testcases[testCaseNo] = {...(testcases[testCaseNo] ?? {testcase:'',result: ''}),testcase:value};
            updated[problemNo] = { ...updated[problemNo]!,testcase: testcases};
            setQuestions(updated);
            // console.log(updated);
        },1000)
    }

    function addTitle(value:string,idx:number){
        if(titleTimeout.current){
            clearTimeout(titleTimeout.current);
        }
        titleTimeout.current= setTimeout(()=>{
            const updated = [...questions];
            updated[idx] = {...updated[idx]!,title:value};
            setQuestions(updated);
        },2000)

    }

    function addDescription(value:string,idx:number){
        if(descriptionTimeout.current){
            clearTimeout(descriptionTimeout.current);
        }
        descriptionTimeout.current = setTimeout(()=>{
            const updated = [...questions];
            updated[idx] = {...updated[idx]!,description:value};
            setQuestions(updated);
            // console.log(updated);
        },2000)
    }
    async function onSubmit(){
        // console.log(questions);
        /// verify this using zod and then send it to the backend for creation and redirect the user to the waiting room
        const contestData = questions.map((q,idx)=>(
            {
                title: q.title,
                description: q.description,
                problemNumber: idx+1,
                testcases: q.testcase.map((tc)=>({testCase:tc.testcase,result:tc.result}))
            }
        ))
        const parsedData = ContestDataSchema.safeParse(contestData);
        if(!parsedData.success){
            throw new Error("Input validation error");
            return;
        }
        // send an api call to register the contest and redirect to the waiting room
        const id = "soat";
        router.replace(`/contest/waiting-room/${id}`)
    }
    return(
        <Card>
            <div className="flex flex-col gap-10 px-6">
                <div className="flex justify-center gap-4 items-center">
                    <div className="text-xl">
                        {"Select the number of questions : "}
                    </div>
                    <select className="w-32 p-2 border border-slate-400 rounded-sm" onChange={(e)=>{
                        let n = Number(e.target.value);
                        setNoOfQuestions(n);
                        if(n<=questions.length){
                            setQuestions([...questions].slice(0,n));
                        }
                    }}>
                        <option value="1" defaultValue={1}>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                {Array.from({length:noOfQuestions}).map((q,idx)=>(
                    <Question idx={idx} key={idx} addTitleAction={addTitle} addDescriptionAction={addDescription} addTestCaseAction={addTestCase} addResultAction={addResult} />
                ))}
            </div>
            <div className="flex justify-center items-center pt-6">
                <Button onClick={async()=>{
                    await onSubmit();
                }} label="Create" className="w-40 flex justify-center rounded-md h-12 items-center hover:bg-slate-300 text-slate-800 font-[550] border border-slate-600 bg-slate-200" />
            </div>
        </Card>
    )
}