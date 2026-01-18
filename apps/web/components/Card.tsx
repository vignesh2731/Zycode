export function Card({children,className}:{children:React.ReactNode,className?:string}){
    return(
        <div className={`rounded-sm shadow-sm py-6 border border-slate-200 ${className}`}>
            {children}
        </div>
    )
}