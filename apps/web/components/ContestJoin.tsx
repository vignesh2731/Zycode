import { getServerSession } from "next-auth";
import { InputWithButton } from "./SearchContest";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function ContestJoin(){
  const session = await getServerSession(authOptions);
  if(!session?.user){
    redirect('/api/auth/signin');
  } 
    return(
        <div className="flex justify-center">
          <div className="flex flex-col mx-auto gap-10 p-10 border border-slate-200 rounded-sm min-h-[300px] shadow-lg">
            <div className="text-xl lg:text-4xl font-sans flex justify-center">
            {"Join Contest"}
            </div>
            <InputWithButton/>
          </div>
        </div>
    )
}