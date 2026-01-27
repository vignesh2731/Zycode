import { ContestJoin } from "@/components/ContestJoin";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect("/api/auth/signin")
    }
    return(
        <div className="pt-20">
            <ContestJoin/>
        </div>
    )
}