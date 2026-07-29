import { CardSmall } from "@/components/DashboardCard"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Create or join a coding contest to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <CardSmall
          label="Create Contest"
          heading="Set up a new coding challenge"
          description="Define problems with testcases and share the contest ID with participants."
          href="/contest/create"
        />
        <CardSmall
          label="Join Contest"
          heading="Enter an existing contest"
          description="Use a contest ID to join and compete with others in real-time."
          href="/contest/join"
        />
      </div>
    </div>
  )
}
