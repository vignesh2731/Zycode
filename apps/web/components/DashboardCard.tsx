"use client"

import { useRouter } from "next/navigation"
import { PlusCircle, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const cardMeta: Record<string, { icon: React.ElementType; accent: string; iconBg: string; cardBg: string }> = {
  "Create Contest": {
    icon: PlusCircle,
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    cardBg: "bg-emerald-50/60 dark:bg-emerald-950/20",
  },
  "Join Contest": {
    icon: Users,
    accent: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    cardBg: "bg-blue-50/60 dark:bg-blue-950/20",
  },
}

export function CardSmall({
  label,
  heading,
  description,
  href,
}: {
  label: string
  heading: string
  description: string
  href: string
}) {
  const router = useRouter()
  const meta = cardMeta[label] ?? cardMeta["Create Contest"]!
  const Icon = meta.icon

  return (
    <Card className={`group w-full transition-shadow hover:shadow-md ${meta.cardBg}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${meta.iconBg}`}>
            <Icon className={`size-5 ${meta.accent}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{label}</CardTitle>
            <CardDescription>{heading}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          onClick={() => router.push(href)}
        >
          {label.split(" ")[0]}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
