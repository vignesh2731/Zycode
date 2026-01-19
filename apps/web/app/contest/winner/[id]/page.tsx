import WinnerPage from "@/components/Winner";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({params}:{params: Promise<{id:string}>}){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signin');
    }
    const {id} = await params;
    const name = "Vignesh";
    // const name = getWinner();
    if(name){
        return (
            <div className="h-screen">
                <WinnerPage winner={name} contestCode={id}/>
            </div>
        )
    }
    else{
        throw new Error("Contest has not ended yet")
    }
}