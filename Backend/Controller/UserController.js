import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({email});

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "user registered successfully", user: newUser 
    });
  } catch (err) {
    console.log("Error in register", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login= async (req,res) =>{
    try{
        const {email,password}=req.body

        const existing=await UserModel.findOne({email})
        if(!existing){
            return res.status(400).json({message:"User do not exist"})
        }

        const isMatch=await bcrypt.compare(password,existing.password)

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=jwt.sign({id:existing._id},
            "Secret123",
            {expiresIn:"1h"}
        )

        res.status(200).json({
  message: "Successfully logged in",
  token,
  user: {
    _id: existing._id,
    name: existing.name,
    email: existing.email,
    isChannel: existing.isChannel, 
  },
});


    }catch(err){
        console.log("Error in login", err);
    res.status(500).json({ message: "Server error", error: err.message });
    }
}