"use client"

import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { WebSocketSingleton } from "@/lib/ws"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Play, LogOut } from "lucide-react"

export function WaitingRoomClient({
  id,
  maker,
}: {
  id: string
  maker: boolean
}) {
  const router = useRouter()
  const session = useSession()
  const userId = session.data?.user.id
  if (!session || !userId) {
    redirect("/api/auth/signin")
  }
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const w = WebSocketSingleton.getInstance(Number(userId), id)
    setSocket(w)
    w?.addEventListener("message", (event) => {
      const parsedData = JSON.parse(String(event.data))
      if (parsedData.msg === "Contest_Started") {
        router.replace(`/contest/${id}/1`)
      }
    })
  }, [userId, id, router])

  return (
    <div className="flex gap-3">
      {maker && (
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: "contest_started",
                userId,
                contestId: id,
              })
            )
          }}
        >
          <Play className="mr-2 size-4" />
          Start
        </Button>
      )}
      <Button
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={async () => {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/exit`,
            { contestId: id },
            {
              headers: {
                Authorization: `Bearer ${session.data?.user.token}`,
              },
            }
          )
          router.replace("/dashboard")
        }}
      >
        <LogOut className="mr-2 size-4" />
        Exit
      </Button>
    </div>
  )
}
