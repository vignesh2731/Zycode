import { getServerSession } from "next-auth"
import { InputWithButton } from "./SearchContest"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function ContestJoin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-xl bg-slate-50 dark:bg-slate-900/30">
        <CardHeader className="items-center text-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Join a Contest</CardTitle>
          </div>
          <CardDescription className="text-sm max-w-xs">
            Enter the contest ID shared by the host to join and compete in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center px-10">
          <InputWithButton />
        </CardContent>
      </Card>
    </div>
  )
}
