import { Router } from 'express'
export const AuthRouter:Router = Router();

AuthRouter.post("/login",(req,res)=>{
    const { username,password } = req.body;
    console.log(username,password);
    res.json({
        ok: true,
        user:{
            id: 1,
            username: username
        }
    })
})