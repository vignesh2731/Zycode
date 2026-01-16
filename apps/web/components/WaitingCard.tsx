export function WaitingCard({name}:{name:string}){
    return(
        <div className="bg-slate-300 pt-4 lg:pt-8 pb-2 flex flex-col w-full max-w-[200px] rounded-sm">
            <div className="text-xl lg:text-2xl flex justify-center items-center w-full">
                <div className="bg-slate-400 p-2 lg:p-4 rounded-full">
                    {name[0]?.toUpperCase()}
                </div>
            </div>
            <div className="flex text-xs justify-end w-full pr-2 pl-2 pt-1 text-black">
                <p className="truncate">{name}</p>
            </div>
        </div>
    )
}