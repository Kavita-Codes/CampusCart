import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { verifyEmail } from "../services/verifyEmail.js";
import { Session } from "../models/session.model.js";
import { sendOTPMail } from "../services/sendOTPMail.js";


export async function register(req,res){
  
    try{
  const { firstName , lastName ,email ,password } = req.body;

  if( !firstName || !lastName || !email || !password){
    return res.status(400).json({
      message:"All fields are required"
    })
  }

  const isAlreadyExists = await User.findOne({email})

  if(isAlreadyExists){
    return res.status(400).json({
      message:"User already exists"
    })
  }

  const hashedPassword = await bcrypt.hash(password , 10)

  const user = await User.create({
    firstName,
    lastName,
    email,
    password:hashedPassword
  
  })
  
  const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10m"})

  verifyEmail(token,email)        //send email

  user.token = token;

  return res.status(201).json({
    message:"User registered successfully",
    user
  
  })
    }catch(error){
      console.log(error)


    }
}

export async function verify(req,res){
    try {
      const authHeader = req.headers.authorization;
      if(!authHeader || authHeader.startsWith("Beared ")){
        return res.status(400).json({
          message:"authorization token is missing or invalid"
        })
      }

      const token = authHeader.split(" ")[1]    //[Bearer, fhfhwfbsbdhs]
      let decoded;
         
      try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)

      } catch (error) {
       if(error.name === "TokenExpiredError"){
        return res.status(400).json({
          message:"Token expired"
        })
       }else{
        return res.status(400).json({
          message:"Invalid token"
        })
       }
      }

      const user =  await User.findById(decoded.id)

      if(!user){
        return res.status(400).json({
          message:"User not found"
        })
      }

      user.token = null
      user.isVerified = true

      await user.save()

      return res.status(200).json({
        message:"User verified successfully"
      })
      
    } catch (error) {
       return res.status(400).json({
        message:"Something went wrong"
      })
    
    }
}

export const reVerify= async(req,res)=>{
    try {
      const {email} = req.body
      const user = await User.findOne({email})

     if(!user){
      return res.status(400).json({
        message:"User not found"
      })
      }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10m"})

  verifyEmail(token,email)
  
  user.token = token

  await user.save()

  return res.status(200).json({
    message:"Email sent again successfully",
    token:user.token
  })


    } catch (error) {
      return res.status(400).json({
        message:error.message
      })
    }
} 

export const login = async(req,res)=>{
  try {
    const {email,password} = req.body

    if(!email || !password){
      return res.status(400).json({
        message:"All fields are required"
      })
    }

    const isExistingUser = await User.findOne({email})
    if(!isExistingUser){
      return res.status(400).json({
        message:"user does not exists",
        success:false
      })
    }

   const isMatch = await bcrypt.compare(password, user.password)

   if(!isMatch){
    return res.status(400).json({
      message:"Invalid credentials",
      success:false
    })

    if(isExistingUser.isVerified === false){
      return res.status(400).json({
        message:"Please verify your email",
        success:false
      })    }
    }

    //generate token

    const accessToken = jwt.sign({id:isExistingUser._id} , process.env.JWT_SECRET, {expiresIn:"10d"})
    const refreshToken = jwt.sign({id:isExistingUser._id} , process.env.JWT_SECRET, {expiresIn:"30d"})

    isExistingUser.isLoggedIn = true

    await isExistingUser.save()

    //check for existing session and delete it
    const existingSession = await Session.findOne({userId:isExistingUser._id})

    if(existingSession){
      await Session.deleteOne(existingSession._id)
    }

// create a new session
   await Session.create({userId:isExistingUser._id})

   return res.status(200).json({
    message: `Welcome back ${isExistingUser.firstName}`,
    accessToken,
    refreshToken
   })
   
   

  } catch (error) {
    return res.status(400).json({
      message:error.message
    })
  }
 }


export const logout = async(req,res)=>{
  try{

    const userId = req.id
    await Session.deleteMany({userId:userId})
    await User.findByIdAndUpdate(userId,{isLoggedIn:false})
    return res.status(200).json({
      message:"Logged out successfully"
    } 
    )

    
  }catch(error){
    return res.status(400).json({
      message:error.message
    })
  }
}

export const forgetPassword = async(req,res)=>{
    try {
      const {email} = req.body
     const user = await User.findOne({email})

     if(!user){
      return res.status(400).json({
        message:"User not found"
      })
     }

     const otp = Math.floor(100000 + Math.random()*900000).toString()
     otpExpiry = new Date(Date.now()*10*60*1000)   //10min

     user.otp = otp
     user.otpExpiry = otpExpiry
     
     await user.save()

     await sendOTPMail(otp,mail)

     return res.status(200).json({
      message:"otp sent to email successfully"
     })
        
    } catch (error) {
      return res.status(400).json({
        message:error.message
      })
    }
}

export const verifyOTP = async(req,res)=>{
  try {
    const {otp} = req.body
    const email = req.params.email
    if(!otp){
      return res.status(400).json({
        message:"otp is required"

      })
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({
        message:"User not found"
      } )
    }

    if(!user.otp || !user.otpExpiry){
      return res.status(400).json({
        message:"otp is not generated or already verified"
      })
    }

    if(user.otpExpiry < new Date()){
      return res.status(400).json({
        message:"otp expired"
      })

    }

    if(otp !== user.otp){
      return res.status(400).json({
        message:"invalid otp"
      })

    }

    user.otp = null
    user.otpExpiry = null

    await user.save()

    return res.status(200).json({
      success:true,
      message:"otp verified successfully"
    })
    


  } catch (error) {
    return res.status(400).json({
      message:error.message
    })
  }
}

export const changePassword = async(req,res)=>{
  try{
          const {newPassword, confirmPassword} = req.body
          const {email} = req.params.email

          const user = await User.findOne({email})
          if(!user){
            return res.status(400).json({
              message:"user not found"
            })
          }

          if(!newPassword || !confirmPassword){
            return res.status(400).json({
              message:"All fields are required"
            })

          }
          if(newPassword !== confirmPassword){
            return res.status(400).json({
              message:"password does not match"
            })
          }

          const hashPassword = await bcrypt.hash(newPassword , 10)
          user.password = hashPassword
          await user.save()

          return res.status(200).json({
           message:"password change successfully"
          })
  }catch(error){

  }

}

export const allUser = async(_,res)=>{
  try{
      const users = await User.find()
      return res.status(200).json({
        message:"all users",
        sucess:true,
        users
      })
  }catch(error){
     return res.status(500).json({
      message:error.message
    })
  }

}

export const getUserById = async(req,res)=>{
  try {
    const {userId} = req.params
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token")

    if(!user){
      return res.status(400).json({
      message:"user not found"
    })
    }

    res.status(200).json({
      message:"user found",
      user
    })
    
  } catch (error) {
    
  }
}