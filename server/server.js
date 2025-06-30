const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const PORT = process.env.PORT || 4000
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')
const authenticateToken = require('./middleware/authenticate')
const JWT_SECRET = process.env.JWT_SECRET

//legacy client_side object: {client_cache : clientSideCache, history_index : history_index}

//updated: chats = {chat_content: [chats], chat_index : chat_index}

//{chats : {user_prompts : [user_input], ai_responses : [ai_final_result]}, history : user_input_history} --history object

let selected_ai = {name : "Darrell Chee", description : "You are a helpful cheerfull man"}
const database_url = process.env.MONGO_URL

app.use(cors());
app.use(express.json())

mongoose.connect(database_url)
.then(() =>{
  console.log("successfully connected to database")
  app.listen(PORT, () => {console.log(`Server is running in port ${PORT}`)})
})
.catch(err => console.log(err))

const AiPresetSchema = new mongoose.Schema({
  name : String,
  description : String,
})

const AiPresetModel = mongoose.model("aipresets", AiPresetSchema)

app.get("/getaipresets", authenticateToken, async (req, res) =>{
  const fetched_data = await AiPresetModel.find();
  res.json({message : fetched_data})
})

app.post("/postaipresets", authenticateToken, async (req, res) =>{
  try{
    const {name, description} = req.body
    const NewAi = await AiPresetModel.create({name, description})
    res.status(201).json(NewAi)
  }catch(err){
    res.json(err)
  }
})

const ChatsSchema = new mongoose.Schema({
  chat_content : Array,
  chat_index : Number,
})

const ChatModel = mongoose.model("chats", ChatsSchema) //{chat_content: [chats], chat_index : chat_index}

app.post("/api", authenticateToken, async (req, res) =>{
  const user_input = req.body.chat_content
  const user_input_index = parseInt(req.body.chat_index, 10)

  const ai_response = async (prompt_request) => {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", 
    {
    model: "gpt-4.1-mini",
    store: true,
    messages: [
      {role: "system", content: `${selected_ai.description}. Your name is ${selected_ai.name}`},
      {role : "user", content : prompt_request}
    ],
    temperature : 1.2,
    frequency_penalty: -0.5 
  }, {
    headers : {
      "Content-Type" : 'application/json',
      "Authorization" : `Bearer ${process.env.GPT_API_KEY}`
    }
  })
  const reply = res.data.choices[0].message.content
  
  return reply
}  

  const ai_final_result = await ai_response(user_input)
  try{
    const result = await ChatModel.findOneAndUpdate(
      {chat_index : user_input_index},
      {$push: {chat_content: ai_final_result}},
      {new: true, upsert: true}
    )
    res.status(201).json(ai_final_result)
  }catch(err){
    res.status(404).json({error : err})
  }})

app.get("/chatHistory", authenticateToken, async (req, res) =>{
  const result = await ChatModel.find()
  res.json(result)
})

app.post("/postFullChatData", authenticateToken, async (req, res) =>{
  const data = req.body.chat_content
  const index = req.body.chat_index
  try{
    const result = await ChatModel.findOneAndUpdate(
      {chat_index : index},
      {$set: { chat_content: data }},
      {new: true, upsert: true}
    )
    res.status(201).json(result)
  }catch(err){
    res.status(404).json({error : err})
  }
})

app.post("/getFullChatData", authenticateToken, async (req, res) =>{
  const index = req.body.chat_index
  try{
    const result = await ChatModel.findOne(
      {chat_index : index},
      { _id: 0, chat_content: 1 }
    );
    if(!result){
      return res.status(404).json({error : "cant find it"})
    }
    res.json(result.chat_content)
  }catch(err){ 
    res.status(404).json({error : err.message})
  }
})

app.post("/setai", authenticateToken, (req, res) =>{
  selected_ai = {name : req.body.name, description : req.body.description}
  res.status(200).json({message : "ai has been successfully set"})
})

app.get("/getAiname", authenticateToken, (req, res) =>{
  res.json({message : selected_ai.name})
})

//===================authentication below
const UserSchema = new mongoose.Schema({
  userName    : { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  legalName   : { type: String, required: true }
})

const UserModel = mongoose.model("users", UserSchema) //{userName: String, password : String}

// client json payload {userName : userDetails.username, password : userDetails.password, legalName : userDetails.legalName}
app.post('/signup', async (req, res) => {
  try {
    const { userName, password, legalName } = req.body
    if (!userName || !password || !legalName) {
      return res.status(400).json({ error: 'All fields required' })
    }
    // 1) check existing
    if (await UserModel.findOne({ userName })) {
      return res.status(409).json({ error: 'Username taken' })
    }
    // 2) hash & save
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({ userName, passwordHash, legalName })
    // 3) issue JWT immediately
    const token = jwt.sign(
      { id: newUser._id, userName: newUser.userName },
      JWT_SECRET,
      { expiresIn: '2h' }
    )
    res.status(201).json({
      user: { id: newUser._id, userName: newUser.userName, legalName },
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body
    const user = await UserModel.findOne({ userName })
    console.log(user)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.passwordHash)
    console.log(valid)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: '2h' }
    )
    res.json({ user: { userName: user.userName }, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})