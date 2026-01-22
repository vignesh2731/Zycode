import { Navbar } from "@/components/Navbar";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/providers/Session";
import { getServerSession } from "next-auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
      <div>
        <SessionProvider session={session}><Navbar children={children} /></SessionProvider>
      </div>
  );
}
