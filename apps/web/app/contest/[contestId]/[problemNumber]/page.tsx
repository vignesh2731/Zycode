import { CodeEditorClient } from "@/components/CodeEditorClient";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"

export default async function Page({params}:{params: Promise<{contestId:string,problemNumber:number}>}){
    const { contestId, problemNumber } = await params; 
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect('/api/auth/signup');
    }
    // fetch title, description from the backend server
    const title = "fihdsjfaisodfjasiodfsadf";
    const description = "hi";
    return(
        <div className="grid md:grid-cols-2 gap-10">
            <QuestionDisplay title={title} description={description}/>
            <CodeEditorClient contestId={contestId} problemNumber={problemNumber}/>
        </div>
    )
}