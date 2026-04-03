"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TestCase } from "./TestCase"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ComponentProps = {
  idx: number
  addTitleAction: (value: string, idx: number) => void
  addDescriptionAction: (value: string, idx: number) => void
  addTestCaseAction: (
    value: string,
    problemId: number,
    testCaseNumber: number
  ) => void
  addResultAction: (
    value: string,
    problemId: number,
    testCaseNumber: number
  ) => void
}

export function Question({
  idx,
  addTitleAction,
  addDescriptionAction,
  addTestCaseAction,
  addResultAction,
}: ComponentProps) {
  const [testcases, setTestCases] = useState<number>(1)

  return (
    <div className="rounded-lg border bg-background/60 p-5 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/40">
          <FileText className="size-4 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-base font-semibold">{`Question ${idx + 1}`}</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input
            placeholder="e.g. Two Sum"
            onChange={(e) => addTitleAction(e.target.value, idx)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <Textarea
            placeholder="Describe the problem statement..."
            rows={4}
            onChange={(e) => addDescriptionAction(e.target.value, idx)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Testcases:</span>
        <Select
          defaultValue="1"
          onValueChange={(v) => setTestCases(Number(v))}
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
      </div>

      <div className="space-y-3">
        {Array.from({ length: testcases }).map((_, i) => (
          <TestCase
            idx={i}
            key={i}
            problemNo={idx}
            testcaseAction={addTestCaseAction}
            resultAction={addResultAction}
          />
        ))}
      </div>
    </div>
  )
}
