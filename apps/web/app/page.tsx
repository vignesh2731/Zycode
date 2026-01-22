"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";

export default function AuroraBackgroundDemo() {
  const router = useRouter();

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold text-center">
          ZyCode
        </div>

        <div className="font-extralight text-base md:text-4xl py-4">
          A web based coding platform
        </div>

        <div className="flex gap-10">
          <button
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black min-w-20 px-4 py-2 cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
          <button
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black min-w-20 px-4 py-2 cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Signup
          </button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
