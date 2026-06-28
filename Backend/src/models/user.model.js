import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
         required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },

    profilePic:{                       //cloudinary image url
        type:String,
        default:""
    },
    profilePicId:{                 // cloudinary public_id for image deletion
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"

    },

    token:{
        type:String,
        default:null
    },

    isVerified:{
        type:Boolean,
        default:false
    },

    isLoggedIn:{
      type:Boolean,
      default:false
    
    },

    otp:{
        type:String,
        default:null
    },

    otpExpiry:{
        type:Date,
        default:null
    },
    address:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null
    },
    zipCode:{
        type:String,
        default:null
    },
    state:{
        type:String,
        default:null
    },
    phoneNo:{
      type:String,
      default:null
    
    } },
    {timestamps:true}
)

const User = mongoose.model("User",userSchema)

export default User