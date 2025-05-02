const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()

// const corsOptions = {
//   origin : ["http://localhost:4000"]
// }

app.use(cors());
app.use(express.json())

app.get("/api", (req,res) => {
    res.json({"users" : ["userOne", "userTwo", "userThree"]})
})

app.post("/api", async (req, res) =>{
    const user_input = req.body
    res.json({"Response message" : user_input})
})

app.post("llm", async(req,res) =>{
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