import { ContestCreateClient } from "@/components/ContestCreateClient";

export default function Page(){
    return(
        <div className="flex flex-col gap-10 pb-20">
            <div className="flex justify-center text-2xl font-[450]">
                <div>
                    {"Create Contest"}
                </div>
            </div>
            <ContestCreateClient/>
        </div>
    )    
}