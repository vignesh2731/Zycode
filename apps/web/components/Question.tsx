"use client"

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { TestCase } from "./TestCase";
import { InputBox } from "./Inputbox";

type ComponentProps = {
    idx:number;
    addTitleAction: (value:string,idx:number)=>void;
    addDescriptionAction: (value:string,idx:number)=>void;
    addTestCaseAction: (value:string,problemId:number,testCaseNumber:number)=>void;
    addResultAction: (value:string,problemId:number,testCaseNumber:number)=>void;
}
export function Question({idx,addTitleAction,addDescriptionAction,addTestCaseAction,addResultAction}:ComponentProps){
    const [testcases,setTestCases] = useState<number>(1);
    return(
        <div className="flex flex-col w-full gap-2 pb-20 border-b border-slate-200">
            <div className="text-lg font-[550]">
                {`Question - ${idx+1}`}
            </div>
            <InputBox placeholder="Title" className="w-fit min-w-60 p-3" onChange={(value)=>{
                addTitleAction(value,idx);
            }} />
            <Textarea placeholder="Description" onChange={(e)=>{
                addDescriptionAction(e.target.value,idx);
            }} />
            <div className="flex justify-center gap-4 items-center pt-10">
                <div className="text-xl">
                    {"Select the number of testcases : "}
                </div>
                <select className="w-32 p-2 border border-slate-400 rounded-sm" onChange={(e)=>setTestCases(Number(e.target.value))}>
                    <option value="1" defaultValue={1}>1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div className="flex flex-col gap-6">
                {Array.from({length:testcases}).map((q,i)=>(
                    <TestCase idx={i} key={i} problemNo={idx} testcaseAction={addTestCaseAction} resultAction={addResultAction}/>
                ))}
            </div>
        </div>
    )
}