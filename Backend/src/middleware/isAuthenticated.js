import User from "../models/user.model.js"
import jwt from "jsonwebtoken"


export async function isAuthenticated(req,res,next){
   try {
    const authHeader = req.header.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({
            message:"invalid token",
            success:false
        })
    }

    const token = authHeader.split(" ")[1]

    let decoded;

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)

    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({
                message:"token expired",
                success:false
            })

        }

        return res.status(400).json({
            message:"invalid token",
            success:false
        })
    }

    const user = await User.findById(decoded._id)

    if(!user){
        return res.status(400).json({
            message:"user not found",
            success:false
        })
    }
    req.user = user
    req.id = user._id

    next()
    
   } catch (error) {
     return res.status(500).json({message:error.message})
   }
}

export async function isAdmin(req,res,next){
    if(req.user && req.user.role === 'admin'){
        next()
    }else{
        return res.status(400).json({
            message:"access denided:Admin Only",
            success:false
        })
    }
}