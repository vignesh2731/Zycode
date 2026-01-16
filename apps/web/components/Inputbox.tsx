"use client"
type ComponentProps = {
    placeholder?: string;
    type?: string;
    onChange?: (value:string)=>void;
    className?: string;
}

export function InputBox({placeholder,type,className,onChange}:ComponentProps){
    return (
        <input placeholder={`${placeholder}`} className={`p-2 rounded-sm border border-slate-800 ${className}`} onChange={(e)=>{
            if(onChange)onChange(e.target.value)
        }}>
        </input>
    )
}