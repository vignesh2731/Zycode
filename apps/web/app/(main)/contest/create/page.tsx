import { ContestCreateClient } from "@/components/ContestCreateClient"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Contest</h1>
        <p className="text-muted-foreground">
          Define your problems and testcases, then share the contest ID.
        </p>
      </div>
      <ContestCreateClient />
    </div>
  )
}
