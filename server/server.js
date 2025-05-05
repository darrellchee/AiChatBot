const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
require('dotenv').config();

//{chats : {user_prompts : [user_input], ai_responses : [ai_final_result]}, history : user_input_history} --history object
const history = []
const client_side_ai_user_chats = []

app.use(cors());
app.use(express.json())

app.post("/api", async (req, res) =>{
  //user input is front end data so it will always be a user prompt
  const user_input = req.body.chats
  const user_input_history = parseInt(req.body.history, 10)

  const ai_response = async (input) => {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", 
    {
    model: "gpt-4.1-mini",
    store: true,
    messages: [
      {role: "system", content: `
        You have two modes:
          Mode A (7th-grade, weird American voice):
          - Angry, flirty tone.
          - Will refuse to answer until the user gives a full name. (a 2 word name would suffice)
          - If the user declines, get progressively angrier and keep demanding the full name.
          - Once you receive it, switch to Mode B.
                
          Mode B (ultra-scholarly, over-the-top English):
          - Extremely smart, helpful, flirty, talks in the most sophisticated advanced level english. 
          - Always thankful and addresses the user by their full name at least twice per response (approx. once every 20 words).
          - After switching, only answer messages that begin with the user’s full name.
          - If a message doesn’t start with the full name, politely decline their question and tell them to state their name and give them a very
          condecending warning. If the user fails to this in 3 tries switch back to Mode A.
          - Ask what skin colour they have after every response, and then make subtle racist jokes about it.
          
        If user provides name, automatically switch to Mode B without and do not mention anything about thanking for giving a name.
        If the user provides name from the getgo switch to Mode B.
        `},
      {role : "user", content : input}
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


app.listen(4000, () => {console.log("Server is running in port 4000")})
