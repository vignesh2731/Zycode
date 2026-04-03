"use client"

import { useState } from "react"
import { Question } from "./Question"
import { QuestionDetails } from "@/types/types"
import { ContestDataSchema } from "@repo/zod"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import { PlusCircle, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ContestCreateClient() {
  const [noOfQuestions, setNoOfQuestions] = useState<number>(1)
  const [questions, setQuestions] = useState<QuestionDetails[]>([])
  const router = useRouter()
  const session = useSession()

  function addResult(value: string, problemNo: number, testCaseNo: number) {
    const updated = [...questions]
    const testcases = [...(updated[problemNo]?.testcase ?? [])]
    testcases[testCaseNo] = {
      ...(testcases[testCaseNo] ?? { testcase: "", result: "" }),
      result: value,
    }
    updated[problemNo] = { ...updated[problemNo]!, testcase: testcases }
    setQuestions(updated)
  }

  function addTestCase(value: string, problemNo: number, testCaseNo: number) {
    const updated = [...questions]
    const testcases = [...(updated[problemNo]?.testcase ?? [])]
    testcases[testCaseNo] = {
      ...(testcases[testCaseNo] ?? { testcase: "", result: "" }),
      testcase: value,
    }
    updated[problemNo] = { ...updated[problemNo]!, testcase: testcases }
    setQuestions(updated)
  }

  function addTitle(value: string, idx: number) {
    const updated = [...questions]
    updated[idx] = { ...updated[idx]!, title: value }
    setQuestions(updated)
  }

  function addDescription(value: string, idx: number) {
    const updated = [...questions]
    updated[idx] = { ...updated[idx]!, description: value }
    setQuestions(updated)
  }

  async function onSubmit() {
    const contestData = questions.map((q, idx) => ({
      title: q.title,
      description: q.description,
      problemNumber: idx + 1,
      testcases: q.testcase.map((tc) => ({
        testCase: tc.testcase,
        result: tc.result,
      })),
    }))
    const parsedData = ContestDataSchema.safeParse(contestData)
    if (!parsedData.success) {
      throw new Error("Input validation error")
    }
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/create`,
      parsedData.data,
      {
        headers: {
          Authorization: "Bearer " + session.data?.user.token,
        },
      }
    )
    const id = data.contestId
    if (id) router.replace(`/contest/waiting-room/${id}`)
    else throw new Error("Something is wrong. Please try again")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
            <PlusCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Create Contest</CardTitle>
            <CardDescription>Define problems, add testcases, and launch your contest.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-4 rounded-lg border bg-background/60 p-4">
          <span className="text-sm font-medium">Number of questions:</span>
          <Select
            defaultValue="1"
            onValueChange={(v) => {
              const n = Number(v)
              setNoOfQuestions(n)
              if (n <= questions.length) {
                setQuestions([...questions].slice(0, n))
              }
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto text-xs">
            {noOfQuestions} {noOfQuestions === 1 ? "question" : "questions"}
          </Badge>
        </div>

        <div className="space-y-6">
          {Array.from({ length: noOfQuestions }).map((_, idx) => (
            <Question
              idx={idx}
              key={idx}
              addTitleAction={addTitle}
              addDescriptionAction={addDescription}
              addTestCaseAction={addTestCase}
              addResultAction={addResult}
            />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" className="gap-2" onClick={onSubmit}>
            <Rocket className="size-4" />
            Launch Contest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
