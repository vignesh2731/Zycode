"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [details, setDetails] = useState({
    username: "",
    password: "",
    name: "",
  })
  const [msg, setMsg] = useState<"User Already Exists" | "Successful" | null>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                onChange={(e) =>
                  setDetails({ ...details, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) =>
                  setDetails({ ...details, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
              />
            </div>
            <Button
              type="button"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`,
                    details
                  )
                  if (res.data.msg === "Exists") {
                    setMsg("User Already Exists")
                  } else if (res.data.msg === "Successfull") {
                    setMsg("Successful")
                    router.replace("/auth/login")
                  }
                } finally {
                  setLoading(false)
                }
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
            {msg && (
              <p
                className={`text-center text-sm font-medium ${msg === "Successful" ? "text-green-600" : "text-destructive"}`}
              >
                {msg}
              </p>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
