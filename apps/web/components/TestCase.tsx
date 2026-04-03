"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ComponentProps = {
  idx: number
  problemNo: number
  testcaseAction: (value: string, problemNo: number, idx: number) => void
  resultAction: (value: string, problemNo: number, idx: number) => void
}

export function TestCase({
  idx,
  problemNo,
  testcaseAction,
  resultAction,
}: ComponentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border border-dashed bg-muted/30 p-4">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{`Input ${idx + 1}`}</Label>
        <Input
          placeholder="e.g. [2, 7, 11, 15], 9"
          onChange={(e) => testcaseAction(e.target.value, problemNo, idx)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{`Expected Output ${idx + 1}`}</Label>
        <Input
          placeholder="e.g. [0, 1]"
          onChange={(e) => resultAction(e.target.value, problemNo, idx)}
        />
      </div>
    </div>
  )
}
