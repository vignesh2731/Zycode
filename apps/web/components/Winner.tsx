"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function WinnerPage({ winner, contestCode }: { winner: string, contestCode: string }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative max-h-screen h-full min-w-screen -mt-12 -ml-20 flex flex-col justify-center gap-20 items-center bg-linear-to-r from-purple-500 via-pink-500 to-yellow-400 text-white">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={500}
        recycle={false}
      />

      <div className="text-4xl font-extrabold drop-shadow-lg animate-bounce">
        🎉 The winner of the contest <span className="text-yellow-300">{contestCode}</span> is 
        <span className="text-green-300"> {winner} 🎉
        </span>
      </div>


      <Link 
        href="/dashboard"
        className="px-6 py-3 bg-white text-purple-700 font-bold rounded-2xl shadow-lg hover:scale-110 transition-all"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
