const express = require("express")
const app = express()

app.get("/api", (req,res) => {
    res.json({"users" : ["userOne", "userTwo", "userThree"]})
})

app.listen(4000, () => {console.log("Server is running in port 4000")})