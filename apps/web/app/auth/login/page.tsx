import { LoginForm } from "@/components/login-form"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if(session?.user){
    redirect("/dashboard");
  }
  return (
    <div className="bg-[#F7F7F7] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
