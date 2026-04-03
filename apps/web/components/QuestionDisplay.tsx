import { FileText, BookOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function QuestionDisplay({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="h-[600px] flex flex-col rounded-[4px] border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="border-b bg-muted/40 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
            <FileText className="size-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight">{title}</h2>
            <Badge variant="secondary" className="text-xs font-normal">
              Problem Statement
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-5">
        <ScrollArea className="h-full pr-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            <BookOpen className="size-3.5" />
            Description
          </div>
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground/80">
            {description}
          </p>
        </ScrollArea>
      </div>
    </div>
  )
}
