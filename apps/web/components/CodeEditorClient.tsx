"use client"

import { useEffect, useState } from "react"
import CodeEditor from "./CodeEditor"
import { WebSocketSingleton } from "@/lib/ws"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RotateCcw, Loader2, CheckCircle2, XCircle, Trophy } from "lucide-react"

export function CodeEditorClient({
  contestId,
  problemNumber,
}: {
  contestId: string
  problemNumber: number
}) {
  const [code, setCode] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<
    "Accepted" | "Wrong" | "Loading..." | null
  >(null)
  const [solver, setSolver] = useState("")
  const [language, setLanguage] = useState("C++")
  const session = useSession()
  const userId = session.data?.user.id
  const router = useRouter()

  useEffect(() => {
    if (!userId) return

    const socket = WebSocketSingleton.getInstance(Number(userId), contestId)
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "init",
          contestId: contestId,
          userId: Number(userId),
        })
      )
    }

    const handleOpen = () => {
      socket.send(
        JSON.stringify({
          type: "init",
          contestId: contestId,
          userId: Number(userId),
        })
      )
    }

    const handleError = (error: Event) => {
      console.error("WebSocket error:", error)
    }

    const handleClose = (event: CloseEvent) => {
      console.log("WebSocket closed:", event.code, event.reason)
    }

    const handleMessage = async (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data)
      if (parsedData.msg === "Wrong") {
        setSubmissionStatus("Wrong")
        await new Promise((r) => setTimeout(r, 4000))
        setSubmissionStatus(null)
      } else if (parsedData.msg === "Correct") {
        setSubmissionStatus("Accepted")
        setSolver(parsedData.solver)
        await new Promise((r) => setTimeout(r, 4000))
        setSubmissionStatus(null)
        if (parsedData.ended) {
          router.replace(`/contest/winner/${contestId}`)
        } else {
          router.replace(`/contest/${contestId}/${Number(problemNumber) + 1}`)
        }
      }
    }

    socket.addEventListener("open", handleOpen)
    socket.addEventListener("message", handleMessage)
    socket.addEventListener("error", handleError)
    socket.addEventListener("close", handleClose)

    return () => {
      socket.removeEventListener("open", handleOpen)
      socket.removeEventListener("message", handleMessage)
      socket.removeEventListener("error", handleError)
      socket.removeEventListener("close", handleClose)
    }
  }, [userId, contestId, problemNumber, router])

  return (
    <div className="h-[600px] flex flex-col relative rounded-[4px] border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-sm font-medium text-muted-foreground">Code Editor</span>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setCode("")}
          >
            <RotateCcw className="size-4" />
          </Button>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C++">C++</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={async () => {
              setSubmissionStatus("Loading...")
              await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submission/submit`,
                {
                  code,
                  language,
                  contestId,
                  problemId: problemNumber,
                },
                {
                  headers: {
                    Authorization: "Bearer " + session.data?.user.token,
                  },
                }
              )
            }}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor code={code} setCodeAction={(value) => setCode(value)} />
      </div>
      {submissionStatus !== null && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-background/60">
          <div
            className={`flex flex-col items-center gap-4 rounded-xl border p-8 shadow-lg ${
              submissionStatus === "Loading..."
                ? "border-border bg-card"
                : submissionStatus === "Wrong"
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/60"
                  : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/60"
            }`}
          >
            {submissionStatus === "Loading..." && (
              <Loader2 className="size-10 animate-spin text-muted-foreground" />
            )}
            {submissionStatus === "Wrong" && (
              <XCircle className="size-10 text-red-500 dark:text-red-400" />
            )}
            {submissionStatus === "Accepted" && (
              <CheckCircle2 className="size-10 text-green-500 dark:text-green-400" />
            )}
            <div className="text-center space-y-1">
              <p
                className={`text-lg font-semibold ${
                  submissionStatus === "Loading..."
                    ? "text-muted-foreground"
                    : submissionStatus === "Wrong"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                }`}
              >
                {submissionStatus === "Loading..."
                  ? "Evaluating..."
                  : submissionStatus === "Wrong"
                    ? "Wrong Answer"
                    : "Accepted!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {submissionStatus === "Loading..."
                  ? "Running your code against testcases"
                  : submissionStatus === "Wrong"
                    ? "Your output didn't match the expected result"
                    : ""}
              </p>
              {submissionStatus === "Accepted" && solver && (
                <div className="flex items-center justify-center gap-2 pt-2 text-sm font-medium text-green-700 dark:text-green-300">
                  <Trophy className="size-4" />
                  Solved by {solver}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
