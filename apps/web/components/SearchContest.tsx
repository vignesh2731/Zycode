"use client"
import { useState } from "react"
import { Button } from "./Button"
import { InputBox } from "./Inputbox"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

enum ContestJoinStatus{
    Correct = "Joined Successfully",
    Wrong = "Wrong Contest ID"
}

export function InputWithButton() {
    const [msg,setMsg] = useState<ContestJoinStatus|null>(null);
    const [id,setId] = useState("");
    const router = useRouter();
    const session = useSession();
    const userId = session.data?.user.id;
    async function onSubmit(){
        // send req to the backend and based on that route to the page or display error message
        /// const res = await axios.post("URL",{id:id,headers:authorization:jwt});
        const res = null;
        if(res){
            setMsg(ContestJoinStatus.Correct);
            await new Promise(r=>setTimeout(r,2000));
            // router.push(`contest/waiting-room/${id}`);
        }
        else{
            setMsg(ContestJoinStatus.Wrong);
            setTimeout(()=>{
                setMsg(null);
            },4000)
        }
    }
  return (
    <div className="flex flex-col gap-10">
        <div className="flex w-full max-w-sm items-center gap-2">
          <InputBox type="ContestID" placeholder="Enter the contest ID to join" className={`w-72 text-xs bg-white`} onChange={(value)=>{
            setId(value);
          }}/>
          <Button label="Join" className="rounded-sm px-12 bg-slate-200 hover:bg-slate-300 font-[550] " onClick={onSubmit}/>
        </div>
        {msg && <div className={`${msg===ContestJoinStatus.Correct? 'text-green-400' : 'text-red-400'} font-[550] flex justify-center lg:text-lg`}>
                {msg}
            </div>
          }
    </div>
  )
}