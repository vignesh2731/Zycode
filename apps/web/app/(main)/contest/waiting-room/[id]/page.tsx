import { WaitingCard } from "@/components/WaitingCard"
import { WaitingRoomClient } from "@/components/WaitingRoomClient"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

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
  const [res1, res2, res3] = await Promise.all([
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/result/${id}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/pariticipants/${id}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    ),
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contest/maker/${id}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    ),
  ])

  const name = res1.data.name
  if (name) {
    redirect(`/contest/winner/${id}`)
  }

  const data = res2.data
  const maker = res3.data.maker === session.user.id
  if (!data.names) {
    throw new Error("Contest does not exist")
  }
  const participants: string[] = data.names

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Waiting Room</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Contest ID:</span>
            <Badge variant="secondary" className="font-mono">
              {id}
            </Badge>
          </div>
        </div>
        <WaitingRoomClient id={id} maker={maker} />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Participants ({participants.length})
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {participants.map((p, key) => (
            <WaitingCard key={key} name={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
