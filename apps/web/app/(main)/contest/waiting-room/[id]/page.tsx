
import { WaitingCard } from "@/components/WaitingCard";
import { WaitingRoomClient } from "@/components/WaitingRoomClient";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({params}:{params: Promise<{id:string}>}){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signin');
    }
    const {id} = await params;
    const [res1,res2,res3] = await Promise.all([axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/result/${id}`,{
            headers:{
                Authorization: `Bearer ${session.user.token}`
            }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/pariticipants/${id}`,{
            headers:{
                Authorization: `Bearer ${session.user.token}`
            }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/maker/${id}`,{
            headers:{
                Authorization: `Bearer ${session.user.token}`
            }
        })
    ])
    const name = res1.data.name;
    if(name){
        redirect(`/contest/winner/${id}`);
    }
    const data = res2.data;
    const maker = res3.data.maker===session.user.id
    if(!data.names){
        throw new Error("Contest doesnot exists")
    }
    const participants:string[] = data.names 
    return(
        <div className="flex flex-col gap-6 pt-16">
            <div className="flex justify-between md:pl-16">
                <div>
                    <p className="text-xl">{`Contest ID - ${id}`}</p>
                </div>
                <WaitingRoomClient id={id} maker={maker} />
            </div>
            <div className="grid grid-cols-4 gap-12">
                {participants.map((p,key)=>(
                    <div key={key} className="flex justify-center">
                        <WaitingCard name={p} />
                    </div>
                ))}
            </div>
        </div>
    )
}