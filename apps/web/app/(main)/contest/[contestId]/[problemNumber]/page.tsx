import { CodeEditorClient } from "@/components/CodeEditorClient";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"

export default async function Page({params}:{params: Promise<{contestId:string,problemNumber:number}>}){
    const { contestId, problemNumber } = await params; 
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signup');
    }
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/problems/${contestId}/${problemNumber}`,{
        headers:{
            Authorization: "Bearer "+session.user.token
        }
    })
    if(!data){
        throw new Error("Invalid Contest ID or Problem Number")
    }
    const title = data.title
    const description = data.title;
    return(
        <div className="grid md:grid-cols-2 gap-10">
            <QuestionDisplay title={title} description={description}/>
            <CodeEditorClient contestId={contestId} problemNumber={problemNumber}/>
        </div>
    )
}