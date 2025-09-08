import mongoose from "mongoose"

const DbConnection=async ()=>{
    try{
        await mongoose.connect("mongodb+srv://karushnika_db_user:UgeyxOpFi1JBsxcZ@cluster0.c16uth6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("DB connected successfully");
    }catch(err){
        console.error("Failed to connect to DB",err.message);
    }
}

export default DbConnection