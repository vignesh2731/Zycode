"use client"

import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        className="relative flex flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <Code2 className="size-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-7xl">
            ZyCode
          </h1>
        </div>

        <p className="max-w-md text-lg font-light text-muted-foreground md:text-2xl">
          A real-time competitive coding platform
        </p>

        <div className="flex gap-4 pt-4">
          <Button
            size="lg"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </Button>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}
