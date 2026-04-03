"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function InputWithButton() {
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const session = useSession()

  async function onSubmit() {
    if (!session.data?.user.token) {
      toast.error("Please wait a moment and try again")
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/join`,
        { contestId: id },
        {
          headers: {
            Authorization: "Bearer " + session.data?.user.token,
          },
        }
      )
      if (res.data.msg !== "Contest Not found") {
        toast.success("Joined successfully!")
        await new Promise((r) => setTimeout(r, 1000))
        router.push(`/contest/waiting-room/${id}`)
      } else {
        toast.error("Contest not found. Check the ID and try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        placeholder="Enter the contest ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <Button onClick={onSubmit} disabled={loading || !id.trim()}>
        {loading ? "Joining..." : "Join"}
      </Button>
    </div>
  )
}
