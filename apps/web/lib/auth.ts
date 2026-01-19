import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';
import { AuthOptions } from 'next-auth'

export const authOptions:AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials:{
                username:{
                    label: "Username", type: "text", placeholder: 'vignesh214@gmail.com'
                },
                password:{
                    label: 'Password', type: 'password'
                }
            },
            async authorize(credentials,req){
                const res = await axios.post("http://localhost:3001/api/auth/login",{
                    username: credentials?.username,
                    password: credentials?.password
                },)
                if(res.data.ok && res.data.user){
                    return{id:res.data.id,email:res.data.username,name:res.data.name};
                }
                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
                token.email= user.email;
            }
            return token;
        },
        async session({session,token}){
            if(session.user && session.user.id){
                session.user.id = token.id as unknown as string;
            }
            return session;
        },
        redirect({url,baseUrl}){
            if(url.startsWith("/"))return `${baseUrl}/${url}`;
            return url;
        }
    }
}