import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password:{
        type:String,
        minLength:6,
        required:true
    }, 
    isChannel:{
      type:Boolean,
      default:false
    }  
},
{timestamps:true}
)

const UserModel=mongoose.model("User",UserSchema)

export default UserModel