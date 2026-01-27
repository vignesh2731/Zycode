import { ContestCreateClient } from "@/components/ContestCreateClient";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signin');
    }
    return(
        <div className="flex flex-col gap-10 pb-20 pt-16 items-center">
            <div className="flex justify-center text-2xl font-[450]">
                <div>
                    {"Create Contest"}
                </div>
            </div>
            <ContestCreateClient/>
        </div>
    )    
}