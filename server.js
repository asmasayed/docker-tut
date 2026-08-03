global.crypto = require('crypto');
const express=require("express")
const path=require("path")
const mongoose=require("mongoose")
require("dotenv").config()

const app=express()
const PORT=5050

//MIDDLEWARE: between client and your router, app.use: for every request use this middleware
//express doesnt automatically parse json coming from frontend, so middleware translates it to js object 
app.use(express.json())
//frontend sends html form elements that are translated to js objs
//extended true: how deeply it parses form elem
app.use(express.urlencoded({extended:true}))
//used to combine path segments, if browser requests GET /style.css then express automatically returns public/style.css
app.use(express.static(path.join(__dirname,"public")))


//DATABASE CONNECTION
const MONGO_URL=process.env.MONGO_URL 

mongoose.connect(MONGO_URL)
    .then(()=>console.log("Mongo Connection Established"))
    .catch((err)=>console.error("Mongo Connection error: ",err))

//Mongoose user schema and model
const UserSchema=new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

//User: Model used to interact with the db
//.model(User)->becomes users in mongodb collections once an object is created and the first entry is added to db
const User=mongoose.model('User',UserSchema)

//ROUTES
app.get("/",(req,res)=>{
    try{
        res.status(200).json({"message":"Welcome"})
    }catch(err){
        res.status(500).json({"error":err.message})
    }
})

app.get("/api/users",async (req,res)=>{
    try{
        const users=await User.find({},'-password')
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({"error":err.message})
    }
})

//signup
app.post("/api/signup",async (req,res)=>{
    try{
        const {fullName,email,password}=req.body
        //check if the user exists
        const user=await User.findOne({email})
        if (user){
            return res.status(400).json({"message":"User already exists"})
        }
        const newUser=new User({
            fullName,email,password
        })
        const savedUser = await newUser.save()
        res.status(201).json({"message":"User created successfully", user: { _id: savedUser._id, fullName: savedUser.fullName, email: savedUser.email }})
    }catch (error) {
    console.error("Signup error detail:", error)
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
})

//login
app.post("/api/login",async (req,res)=>{
    try{
        const {email,password}=req.body
        //check if the user exists
        const user=await User.findOne({email})
        if (!user){
            return res.status(404).json({"message":"User Not found"})
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        res.status(200).json({ message: 'User login successful', user: { _id: user._id, fullName: user.fullName, email: user.email } })
        
    }catch (error) {
    res.status(500).json({ message: 'Error  Logging in', error: error.message });
  }
})

//listen to requests
app.listen(PORT ,()=>{
    console.log(`Listening to requests at http://localhost:${PORT}`)
})

app.get("/favicon.io",(req,res)=>{
    res.status(200)
})