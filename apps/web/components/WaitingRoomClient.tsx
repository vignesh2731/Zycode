"use client"

import { useRouter } from "next/navigation"
import { Button } from "./Button"
import { useEffect, useState } from "react";
import { WebSocketSingleton } from "@/lib/ws";

export function WaitingRoomClient({id}:{id:string}){
    const router = useRouter();
    const userId = 1;
    useEffect(()=>{
        const w = WebSocketSingleton.getInstance(userId,id)
        w?.addEventListener('message',(event)=>{
            const data = String(event.data);
            const parsedData = JSON.parse(data);
            if(parsedData.msg==='Contest_Started'){
                router.replace(`/contest/${id}/1`);
            }
        })
    },[])
    return(
        <div className="flex justify-end pr-20">
           <Button label="Exit Contest" className="w-fit p-3 rounded-sm hover:bg-orange-300 font-[550] bg-orange-200 text-orange-600"
           onClick={()=>{
            router.replace('/');
           }}/>
        </div>
    )
}