const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
require('dotenv').config();

//{chats : {user_prompts : [user_input], ai_responses : [ai_final_result]}, history : user_input_history} --history object
const history = []
const client_side_ai_user_chats = []
const ai_presets = [{name : 'Darrell Chee', description : ''}, {name : 'Samuel Jason', description : `You are cho and darrell Chee's own biological sister.`}]
let selected_ai = ''

app.use(cors());
app.use(express.json())

app.post("/api", async (req, res) =>{
  //user input is front end data so it will always be a user prompt
  const user_input = req.body.chats
  const user_input_history = parseInt(req.body.history, 10)
  console.log(selected_ai)
  const ai_response = async (prompt_request) => {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", 
    {
    model: "gpt-4.1-mini",
    store: true,
    messages: [
      {role: "system", content: selected_ai.description},
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
  if(history[user_input_history] == undefined){
    history.push({chats : {user_prompts : [user_input], ai_responses : [ai_final_result]}, history : user_input_history})
    res.json({"Response" : ai_final_result})
  }else{
    history[user_input_history].chats.user_prompts.push(user_input)
    history[user_input_history].chats.ai_responses.push(ai_final_result)
    res.json({"Response" : ai_final_result})
  }    
  }
  )

app.get("/historyData", (req, res) =>{
  res.json(history)
})

app.get("/client_side_ai_user_chats", (req ,res) =>{
  res.json(client_side_ai_user_chats)
})

app.post("/postFullChatData", (req, res) =>{
  const data = req.body.client_cache
  const index = req.body.history_index
  if(client_side_ai_user_chats.find(object => object.history_index == index) === undefined){
    client_side_ai_user_chats.push({client_cache : data, history_index : index})
    return res.sendStatus(200);
  }else{
    const client_side_chats_index = client_side_ai_user_chats.findIndex(object => object.history_index == index)
    client_side_ai_user_chats[client_side_chats_index].client_cache.length = 0
    client_side_ai_user_chats[client_side_chats_index].client_cache = data
    res.sendStatus(200);
  }
})

app.post("/getFullChatData", (req, res) =>{
  const index = req.body.history_index
  const returned_attribute = client_side_ai_user_chats.find(object => object.history_index == index)
  if(!returned_attribute){
    return res.status(404).send("nothing is found")
  }
  console.log("Response to client: " , returned_attribute.client_cache)
  res.json({"response" : returned_attribute.client_cache})
})

app.get("/getaipresets", (req, res) =>{
  console.log(ai_presets)
  res.json({"message" : ai_presets})
})

app.post("/postaipresets", (req, res) =>{
  ai_presets.push({name : req.body.name, description : req.body.description})
  console.log(ai_presets)
  res.json(ai_presets)
})

app.post("/setai", (req, res) =>{
  selected_ai = {name : req.body.name, description : req.body.description}
  res.status(200).json({message : "ai has been successfully set"})
})

app.listen(4000, () => {console.log("Server is running in port 4000")})
