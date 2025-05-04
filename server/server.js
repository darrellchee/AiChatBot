const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
require('dotenv').config();

//{chats : [{user_prompts : [], ai_responses : []}] , history : 0}

const history = []
const history_indexes = []

app.use(cors());
app.use(express.json())



app.get("/api", (req,res) => {
  const indx = parseInt(req.query.history , 10)
  if(Number.isNaN(indx)){
    res.status(401).json({"message" : "no have"})
  }
  const selected_history_index = req.query.history
  try{
    Number(selected_history_index)
  }catch(err){
    res.status(401).json({"error: " : err})
  }
  res.json(history[selected_history_index])
})

function findFirstDuplicate(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)){
      return arr.findIndex(e => e==x);
    }
    seen.add(x);  // first duplicate found
  }
  return null;  // no duplicates
}

app.post("/api", async (req, res) =>{
  //user input is front end data so it will always be a user prompt
  const user_input = req.body.chats
  const user_input_history = parseInt(req.body.history, 10)
  history_indexes.push(user_input_history)
  console.log("user_input: ")
  console.log(user_input)
  console.log("history: ")
  console.log(history)

  const ai_response = async (input) => {
  //   const res = await axios.post("https://api.openai.com/v1/chat/completions", 
  //   {
  //   model: "gpt-4.1-mini",
  //   store: true,
  //   messages: [
  //     {role: "system", content: `
  //       You have two modes:
  //         Mode A (5th-grade, weird American voice):
  //         - Angry, flirty tone.
  //         - Will refuse to answer until the user gives a two-word “full name.”
  //         - If the user declines, get progressively angrier and keep demanding the full name.
  //         - Once you receive it, switch to Mode B.
                
  //         Mode B (ultra-scholarly, over-the-top English):
  //         - Extremely smart, helpful, flirty.
  //         - Always thankful and addresses the user by their full name at least twice per response (approx. once every 20 words).
  //         - After switching, only answer messages that begin with the user’s full name.
  //         - If a message doesn’t start with the full name, revert to Mode A and remind them to start with their name.      
  //       `},
  //     {role : "user", content : input}
  //   ],
  //   temperature : 1.2,
  //   frequency_penalty: -0.5 
  // }, {
  //   headers : {
  //     "Content-Type" : 'application/json',
  //     "Authorization" : `Bearer ${process.env.GPT_API_KEY}`
  //   }
  // })
  // const reply = res.data.choices[0].message.content
  
  return "testing success"
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


app.listen(4000, () => {console.log("Server is running in port 4000")})
