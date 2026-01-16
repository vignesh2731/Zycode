"use client"

import { useRouter } from "next/navigation"
import { Button } from "./Button"
import { useEffect } from "react";

export function WaitingRoomClient(){
    const router = useRouter();
    useEffect(()=>{
        setTimeout(()=>{
            /// check if the contest is started or not after every 5 second by hitting an api. 
            // If the api returns a valid reponse then redirect the user to a contest page
        },5000)
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