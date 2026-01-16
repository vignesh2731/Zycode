export function Card({children}:{children:React.ReactNode}){
    return(
        <div className="rounded-sm shadow-sm py-6 border border-slate-200">
            {children}
        </div>
    )
}