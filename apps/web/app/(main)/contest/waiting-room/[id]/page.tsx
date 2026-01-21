import { getPariticipants } from "@/actions/actions";
import { WaitingCard } from "@/components/WaitingCard";
import { WaitingRoomClient } from "@/components/WaitingRoomClient";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({params}:{params: Promise<{id:string}>}){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signin');
    }
    const {id} = await params;
    const pariticipants:string[] = await getPariticipants(id); 
    return(
        <div className="flex flex-col gap-6">
            <div className="flex justify-between md:pl-16">
                <div>
                    <p className="text-xl">{`Contest ID - ${id}`}</p>
                </div>
                <WaitingRoomClient id={id} />
            </div>
            <div className="grid grid-cols-4 gap-12">
                {pariticipants.map((p,key)=>(
                    <div key={key} className="flex justify-center">
                        <WaitingCard name={p} />
                    </div>
                ))}
            </div>
        </div>
    )
}