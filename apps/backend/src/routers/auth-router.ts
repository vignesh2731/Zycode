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
    res.json({
        token,
        ok: true,
        email: data.username,
        name: data.name,
        id: data.id
    })
})

AuthRouter.post("/signup",async(req,res)=>{
    const { username, password, name } = req.body;
    const r = await prisma.user.findFirst({
        where:{
            username
        }
    })
    if(r){
        res.json({
            msg: "Exists"
        })
        return;
    }
    await prisma.user.create({
        data:{
            username,
            password,
            name
        }
    })
    res.json({
            msg: "Successful"
    })
})