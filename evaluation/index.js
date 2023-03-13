
const express = require("express")
const {connection} = require("./db")
require("dotenv").config()
const {userrouter} = require("./router")
const app = express()

app.use(express.json())


app.get("/",(req,res)=>{

    res.send("wlc to home page")
})
app.use("/",userrouter)

app.listen(process.env.port,async()=>{
      
    try{
        await connection
        console.log("db is connect")
    }catch(err){
        console.log({err:err.message})
        
    }
    console.log(`server is running at port ${process.env.port}.........`)
})

