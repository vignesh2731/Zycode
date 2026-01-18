import { getPariticipants } from "@/actions/actions";
import { WaitingCard } from "@/components/WaitingCard";
import { WaitingRoomClient } from "@/components/WaitingRoomClient";

export default async function Page({params}:{params: Promise<{id:string}>}){
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