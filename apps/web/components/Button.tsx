"use client"

type ComponentProps = {
    label: string,
    onClick?: ()=>void;
    className?: string;
}

export function Button({label,onClick,className}:ComponentProps){
    return(
        <div className={`border border-slate-200 p-2 ${className} cursor-pointer`} onClick={()=>{
            if(onClick)onClick();
        }}>
            {label}
        </div>
    )
}