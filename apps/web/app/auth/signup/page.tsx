import { SignupForm } from "@/components/signup-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Code2 } from "lucide-react"
import Link from "next/link"

export default async function SignupPage() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Code2 className="size-4" />
          </div>
          ZyCode
        </Link>
        <SignupForm />
      </div>
    </div>
  )
}
