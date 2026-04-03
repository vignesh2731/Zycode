import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function WaitingCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
      <Avatar className="size-12">
        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
          {name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="max-w-[120px] truncate text-sm font-medium">{name}</p>
    </div>
  )
}
