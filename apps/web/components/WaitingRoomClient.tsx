"use client"

import { redirect, useRouter } from "next/navigation"
import { Button } from "./Button"
import { useEffect, useState } from "react";
import { WebSocketSingleton } from "@/lib/ws";
import { useSession } from "next-auth/react";
import axios from "axios";

export function WaitingRoomClient({id,maker}:{id:string,maker:boolean}){
    const router = useRouter();
    const session = useSession();
    const userId = session.data?.user.id;
    if(!session || !userId){
        redirect("/api/auth/signin");
    }
    const[socket,setSocket] = useState<WebSocket|null>(null);
    useEffect(()=>{
        const w = WebSocketSingleton.getInstance(Number(userId),id);
        setSocket(w);
        w?.addEventListener('message',(event)=>{
            const data = String(event.data);
            const parsedData = JSON.parse(data);
            if(parsedData.msg==='Contest_Started'){
                router.replace(`/contest/${id}/1`);
            }
        })
    },[])
    return(
        <div className="flex justify-end gap-10 pr-20">
            {maker && <Button label="Start" className="w-fit p-3 rounded-sm hover:bg-green-300 font-[550] bg-green-200 text-green-600"
           onClick={()=>{
            // set contest Status to Started 
                socket?.send(JSON.stringify({
                    type: "contest_started",
                    userId,
                    contestId: id
                }))
           }}/>}
           <Button label="Exit Contest" className="w-fit p-3 rounded-sm hover:bg-orange-300 font-[550] bg-orange-200 text-orange-600"
           onClick={async()=>{
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/exit`,{
                contestId: id
            },{
                headers:{
                    Authorization: `Bearer ${session.data?.user.token}`
                }
            })
            router.replace('/dashboard');
           }}/>
        </div>
    )
}