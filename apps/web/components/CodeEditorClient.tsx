"use client"
import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import { Button } from "./Button";
import { WebSocketSingleton } from "@/lib/ws";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export function CodeEditorClient({contestId,problemNumber}:{contestId:string,problemNumber:number}){
    const[code,setCode] = useState("");
    const[submissionStatus,setSubmissionStatus] = useState<'Accepted'|'Wrong' | 'Loading...' | null>(null);
    const [solver,setSolver] = useState("");
    const[language,setLanguage] = useState("");
    const session = useSession();
    const userId = session.data?.user.id 
    const router = useRouter();
    useEffect(()=>{
        // Don't create socket if userId is not available yet
        if(!userId){
            console.log("Waiting for userId...");
            return;
        }

        const socket = WebSocketSingleton.getInstance(Number(userId),contestId);
        if(socket.readyState === WebSocket.OPEN){
            console.log("SOCKET ALREADY OPEN", socket.url);
            socket.send(JSON.stringify({
                type: 'init',
                contestId: contestId,
                userId: Number(userId)
            }));
        }

        const handleOpen = () => {
            console.log("SOCKET OPENED", socket.url);
            socket.send(JSON.stringify({
                type: 'init',
                contestId: contestId,
                userId: Number(userId)
            }));
        };

        const handleError = (error: Event) => {
            console.error("WebSocket error:", error);
        };

        const handleClose = (event: CloseEvent) => {
            console.log("WebSocket closed:", event.code, event.reason);
        };

        const handleMessage = async(event: MessageEvent) => {
            const message = event.data;
            const parsedData = JSON.parse(message);
            if(parsedData.msg==='Wrong'){
                setSubmissionStatus('Wrong');
                await new Promise(r=>setTimeout(r,4000));
                setSubmissionStatus(null);
            }
            else if(parsedData.msg==='Correct'){
                setSubmissionStatus('Accepted');
                const solver = parsedData.solver;
                const ended = parsedData.ended;
                const winner = parsedData.winner;
                setSolver(solver);
                await new Promise(r=>setTimeout(r,4000));
                setSubmissionStatus(null);
                if(ended){
                    router.replace(`/contest/winner/${contestId}`);
                }
                else{
                    router.replace(`/contest/${contestId}/${Number(problemNumber)+1}`)
                }
            }
        };

        socket.addEventListener("open", handleOpen);
        socket.addEventListener('message', handleMessage);
        socket.addEventListener('error', handleError);
        socket.addEventListener('close', handleClose);
        console.log("ADDED LISTENERS");

        return () => {
            console.log("Cleaning up socket listeners");
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("message", handleMessage);
            socket.removeEventListener("error", handleError);
            socket.removeEventListener("close", handleClose);
        };
    },[userId, contestId, problemNumber, router])
    return (
        <div className="flex flex-col gap-1 relative">
            <div className="flex justify-end gap-10 -mt-10 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer" onClick={()=>{
                    setCode("");
                }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <select className="border-2 border-slate-300 rounded-sm w-20 p-2 bg-white" onChange={(e)=>setLanguage(e.target.value)}>
                    <option defaultValue={"C++"}>C++</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                </select>
                <Button label="Submit" className={`px-4 w-fit p-2 rounded-md border border-slate-200 text-green-500 font-[550] bg-white hover:bg-gray-300`} onClick={()=>{
                    setSubmissionStatus('Loading...');
                    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submission/submit`,{
                        code:code,
                        language:language,
                        contestId:contestId,
                        problemId:problemNumber
                    },{
                        headers:{
                            Authorization: "Bearer "+session.data?.user.token
                        }
                    })
                }} />
            </div>
            <CodeEditor code={code} setCodeAction={(value)=>{
                setCode(value);
            }} />
            {submissionStatus!==null &&
                <div className={`w-full absolute bottom-0 font-[550] text-xl flex justify-center p-20 rounded-sm ${submissionStatus==='Loading...'? 'bg-slate-200 text-black': (submissionStatus==='Wrong')? 'bg-red-200 text-red-500': 'bg-green-200 text-green-500'}`}>
                    {submissionStatus}{submissionStatus==='Accepted'? " Submission : " + solver :'.'}
                </div>
            }
        </div>
    )
}