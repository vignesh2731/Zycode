"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function WinnerPage({
  winner,
  contestCode,
}: {
  winner: string
  contestCode: string
}) {
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
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={500}
        recycle={false}
      />

      <div className="flex flex-col items-center gap-4">
        <Trophy className="size-16 text-yellow-500" />
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Contest {contestCode} Winner
        </h1>
        <p className="text-xl text-muted-foreground sm:text-2xl">
          Congratulations to{" "}
          <span className="font-bold text-primary">{winner}</span>!
        </p>
      </div>

      <Button asChild size="lg">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
