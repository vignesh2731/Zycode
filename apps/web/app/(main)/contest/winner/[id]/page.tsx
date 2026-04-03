import WinnerPage from "@/components/Winner"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/api/auth/signin")
  }
  const { id } = await params
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/result/${id}`,
    { headers: { Authorization: `Bearer ${session.user.token}` } }
  )
  const name = res.data.name
  if (name) {
    return <WinnerPage winner={name} contestCode={id} />
  } else {
    throw new Error("Contest has not ended yet")
  }
}
