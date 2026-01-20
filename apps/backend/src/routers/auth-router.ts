import { prisma } from '@repo/db/client';
import { Router } from 'express'
import  jwt  from 'jsonwebtoken'
export const AuthRouter:Router = Router();

AuthRouter.post("/login",async(req,res)=>{
    const { username,password } = req.body;
    if(!process.env.SECRET){
        console.log("No secret");
        return;
    }
    const data = await prisma.user.findFirst({
        where:{
            username: username
        }
    })
    if(!data || data.password!==password)return res.json({ok:false});
    const token = jwt.sign({id:data.id},process.env.SECRET);
    // const data = {username, name:"Vignesh", id:1}
    // const token = jwt.sign({id:data.id},"secret");
    res.json({
        token,
        ok: true,
        email: data.username,
        name: data.name,
        id: data.id
    })
})