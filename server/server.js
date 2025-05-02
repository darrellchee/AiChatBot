const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()

// const corsOptions = {
//   origin : ["http://localhost:4000"]
// }

const history = []
const history_indexes = []

app.use(cors());
app.use(express.json())

app.get("/api", (req,res) => {
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

console.log(findFirstDuplicate([5,3,7,3,9])); // 3



app.post("/api", async (req, res) =>{
  const user_input = req.body.message
  const user_input_history = req.body.message.history
  history_indexes.push(user_input_history)
  history.push(user_input)
  const result = findFirstDuplicate(history_indexes)
  if(result !=null){history.splice(Number(result), 1)}
  console.log(user_input)
  console.log(history)
  res.json({"Response message" : user_input})
})

app.get("/historyData", (req, res) =>{
  res.json(history)
})


app.post("/llm", async(req,res) =>{
  LLM_URL = 'http://127.0.0.1:1234/v1/models';
  LLM_ID = "deepseek-r1-distill-qwen-7b";
  USER_INPUT = req.body.message
})


// const openai = new gpt({
//   apiKey: process.env.GPT_API_KEY
// });
// const completion = (input) => openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     store: true,
//     messages: [
//       {"role": "user", "content": input},
//     ],
//   });


// app.post("/llm", async (req, res) => {
//   const LLM_URL = 'http://127.0.0.1:1234/v1/models';
//   const MODEL_ID = "deepseek-r1-distill-qwen-7b";
//   const user_input = req.body.message
//   if(!user_input){
//     res.status(404).json({message : "No userinput provided"})
//   }

//   try{
//     const payload ={
//       model : MODEL_ID,
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user',   content: userMessage }
//       ],
//       temperature: 0.7
//     };
  
//   const llmResp = await axios.post(LLM_URL, payload, {
//     headers: { 'Content-Type': 'application/json' }
//   });

//   res.json(llmResp)

//   }catch(err){
//     console.log(err);
//     res.status(500).json({message : err})
//   }

// });

app.listen(4000, () => {console.log("Server is running in port 4000")})