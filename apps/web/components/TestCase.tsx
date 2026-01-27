"use client"

import { InputBox } from "./Inputbox"

type ComponentProps = {
    idx: number;
    problemNo: number;
    testcaseAction: (value:string,problemNo:number,idx:number)=>void;
    resultAction: (value:string,problemNo:number,idx:number)=>void;
}

export function TestCase({idx,problemNo,testcaseAction,resultAction}:ComponentProps){
    return(
        <div className="grid grid-cols-2 gap-10 pt-4">
            <div className="flex flex-col gap-2 items-center pt-6">
                <div className="text-xl font-[550]">
                    {`Testcase - ${idx+1}`}
                </div>
                <div>
                    <InputBox placeholder="Enter the testcase" className="w-fit p-3 min-w-60 max-w-full" onChange={(value)=>{
                        testcaseAction(value,problemNo,idx);
                    }} />
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center pt-6">
                <div className="text-xl font-[550]">
                    {`Result - ${idx+1}`}
                </div>
                <div>
                    <InputBox placeholder="Enter the result" className="w-fit p-3 min-w-60 max-w-full" onChange={(value)=>{
                        resultAction(value,problemNo,idx);
                    }}/>
                </div>
            </div>
        </div>
    )
}