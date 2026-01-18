import { CodeEditorClient } from "@/components/CodeEditorClient";
import { QuestionDisplay } from "@/components/QuestionDisplay";

export default async function Page({params}:{params: Promise<{contestId:string,problemNumber:number}>}){
    const { contestId, problemNumber } = await params; 
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