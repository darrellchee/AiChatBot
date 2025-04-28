const express = require("express")
const app = express()
<<<<<<< HEAD
const gpt = require('openai').OpenAI


// const openai = new gpt({
//     apiKey: ""
//   });

app.use(express.json())
=======
>>>>>>> parent of f47f4df (implemented openAI API, seeking to replace with local deepseek)

app.get("/api", (req,res) => {
    res.json({"users" : ["userOne", "userTwo", "userThree"]})
})

app.listen(4000, () => {console.log("Server is running in port 4000")})