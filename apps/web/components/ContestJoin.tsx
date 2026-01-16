import { InputWithButton } from "./SearchContest";

export function ContestJoin(){
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