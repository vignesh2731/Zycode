"use client"

import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { AuroraBackground } from "./ui/aurora-background";
import { motion } from "framer-motion";

export function Navbar({children}:{children:React.ReactNode}){
    const navBar = [{name:"Home",href:'dashboard'},{name:"Contest",href:"contest/create"},{name:"Report",href:'report'}];
    const [theme,setTheme] = useState<'light'|'dark'>("light")
    const router = useRouter();
    return(
        <div className={` h-screen flex flex-col text-xs md:text-sm lg:text-md`}>
            <div className={`grid grid-cols-2 md:px-10 p-4  border-b border-slate-100 shadow-sm font-sans`}>
                <div className="flex gap-4 md:gap-16 items-center">
                    <Image src={'/logo.png'} alt="" width={40} height={20} className="cursor-pointer" onClick={()=>{
                        router.push('/')
                    }} />
                    {navBar.map((nv,key)=>(
                        <div key={key} onClick={()=>{
                            router.push(`/${nv.href}`)
                        }} className={`cursor-pointer  ${theme==='light' ? 'hover:text-black text-slate-600' : 'hover:text-gray-400'}`}>{nv.name}</div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 md:gap-32 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:bg-slate-300  rounded-full">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <p className="cursor-pointer" onClick={()=>{
                        signOut({callbackUrl: 'http://localhost:3000/'});
                    }}>Logout</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer rounded-full hover:bg-slate-300" onClick={()=>{
                        setTheme(theme==='light' ?'dark':'light')
                    }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                </div>
            </div>
            <AuroraBackground>
                <motion.div className="relative gap-4 px-4 min-h-screen">
                    {children}
                </motion.div>
            </AuroraBackground>

        </div>
    )
}