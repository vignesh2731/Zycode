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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const[details,setDetails] = useState<{username:string,password:string,name:string}>({username:"",password:"",name:""});
  const[msg,setMsg] = useState<'User Already Exists'| 'Successful' | null>();
  const router = useRouter();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required onChange={(e)=>{
                  setDetails({...details,name:e.target.value});
                }} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e)=>{
                    setDetails({...details,username:e.target.value});
                  }}
                />
              </Field>
              <Field>
                <Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required onChange={(e)=>{
                      setDetails({...details,password:e.target.value});
                    }} />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" className="bg-black text-white cursor-pointer" onClick={async()=>{
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`,details);
                    if(res.data.msg==='Exists'){
                      setMsg('User Already Exists')
                    }
                    else if(res.data.msg==='Successfull'){
                      setMsg('Successful');
                      router.replace('/auth/login');
                    }
                }}>Create Account</Button>
                <div className={`flex justify-center text-md ${msg==='Successful'? 'text-green-500' :'text-red-500'} font-semibold`}>
                  {msg}
                </div>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/auth/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
