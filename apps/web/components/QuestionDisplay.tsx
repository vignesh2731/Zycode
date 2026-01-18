import { Card } from "./Card";

export function QuestionDisplay({title,description}:{title:string,description:string}){
    return(
        <Card className="px-6 min-h-[550px] max-h-[550px] pb-20 flex flex-col gap-6 bg-zinc-50 overflow-y-auto break-all">
            <div className="text-3xl font-bold">
                {title}
            </div>
            {description}
        </Card>
    )
}