import express from "express"
import DbConnection from "./config.js"
import UserRoutes from "./Routes/UserRoutes.js"
import cors from "cors"
import CommentRoutes from "./Routes/CommentRoutes.js"

const app=express()

app.use(express.json())
app.use(cors())

DbConnection()



app.use("/api/user",UserRoutes)
app.use("/api/comments",CommentRoutes)
let PORT=5000
app.listen(PORT,(req,res)=>{
    console.log(`Server running in port ${PORT}`);
})