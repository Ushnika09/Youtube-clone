import express from "express"
import DbConnection from "./config.js"
import UserRoutes from "./Routes/UserRoutes.js"
import cors from "cors"
import CommentRoutes from "./Routes/CommentRoutes.js"
import videoRoutes from "./Routes/VideoRoutes.js"
// import dotenv from "dotenv";
// dotenv.config();
// console.log("🔑 RAPIDAPI_KEY from env:", process.env.RAPIDAPI_KEY);


const app=express()

app.use(express.json())
app.use(cors())

DbConnection()



app.use("/api/user",UserRoutes)
app.use("/api/comments",CommentRoutes)
app.use("/api/videos", videoRoutes);
let PORT=5000
app.listen(PORT,(req,res)=>{
    console.log(`Server running in port ${PORT}`);
})