import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';
import { AuthOptions } from 'next-auth'


declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        token?: string | null;
      };
    }
    interface DefaultUser {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
        accessToken?: string | null
    }
}

declare module "next-auth/jwt"{
    interface DefaultJWT{
        name?: string | null
        email?: string | null
        picture?: string | null
        sub?: string
        accessToken?: string | null
    }
}


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
                if(res.data.ok){
                    return {
                        accessToken: res.data.token, 
                        email: res.data.email, 
                        name: res.data.name, 
                        id: res.data.id
                    }
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
                token.accessToken=user.accessToken;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id as string;
                session.user.token = token.accessToken;
            }
            return session;
        },
        redirect({url,baseUrl}){
            if(url.startsWith("/"))return `${baseUrl}/${url}`;
            return url;
        }
    }
}