import { CodeEditorClient } from "@/components/CodeEditorClient"
import { QuestionDisplay } from "@/components/QuestionDisplay"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ contestId: string; problemNumber: number }>
}) {
  const { contestId, problemNumber } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/api/auth/signup")
  }

  const [res1, res2, res3] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/result/${contestId}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    ),
    axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/question-status`,
      { contestId, problemNumber: Number(problemNumber) },
      { headers: { Authorization: "Bearer " + session.user.token } }
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/problems/${contestId}/${problemNumber}`,
      { headers: { Authorization: "Bearer " + session.user.token } }
    ),
  ])

  const name = res1.data.name
  if (name) {
    redirect(`/contest/winner/${contestId}`)
  }
  if (res2.data.msg === "Question Completed") {
    redirect(`/contest/${contestId}/${Number(problemNumber) + 1}`)
  }

  const data = res3.data
  if (!data) {
    throw new Error("Invalid Contest ID or Problem Number")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <QuestionDisplay title={data.title} description={data.description} />
      <CodeEditorClient contestId={contestId} problemNumber={problemNumber} />
    </div>
  )
}
