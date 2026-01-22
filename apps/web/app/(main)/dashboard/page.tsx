import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function Page(){
    const session = await getServerSession(authOptions);
    if(!session?.user){
        redirect("/auth/login");
    }
    return(
        <div>
            DashBoard page
        </div>
    )
}