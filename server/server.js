const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authenticate");
const JWT_SECRET = process.env.JWT_SECRET;

let selected_ai = {
  name: "Darrell Chee",
  description: "You are a helpful cheerful man",
};

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("successfully connected to database");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

const AiPresetSchema = new mongoose.Schema({
  name: String,
  description: String,
});
const AiPresetModel = mongoose.model("aipresets", AiPresetSchema);

app.get("/getaipresets", authenticateToken, async (req, res) => {
  const fetched = await AiPresetModel.find();
  res.json({ message: fetched });
});

app.post("/postaipresets", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newAi = await AiPresetModel.create({ name, description });
    res.status(201).json(newAi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const ChatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  chat_index: { type: Number, required: true },
  chat_content: [
    {
      message: { type: String, required: true },
      sender: { type: String, required: true },
      ts: { type: Date, default: Date.now },
    },
  ],
});
const ChatModel = mongoose.model("chats", ChatsSchema);

app.post("/deleteChat", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const idx = parseInt(req.body.chat_index, 10);
  if (isNaN(idx)) {
    return res.status(400).json({ error: "Invalid chat index" });
  }
  try {
    const result = await ChatModel.deleteOne({ userId, chat_index: idx });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Chat not found" });
    } else {
      res.status(200).json({ message: "Chat deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api", authenticateToken, async (req, res) => {
  const prompt   = req.body.chat_content;
  const idx      = parseInt(req.body.chat_index, 10);
  const userId   = req.user.id;
  const userName = req.user.userName;
  if(prompt.length > 800) {
    return res.status(400).json({ error: "Prompt cannot be that long" });
  }

  const ai_response = async (p) => {
    const r = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        store: true,
        messages: [
          {
            role: "system",
            content: `${selected_ai.description}. Your name is ${selected_ai.name}`,
          }
        ],
        temperature: 1.2,
        frequency_penalty: -0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GPT_API_KEY}`,
        },
      }
    );
    return r.data.choices[0].message.content;
  };

  try {
    const aiReply = await ai_response(prompt);
    const userDoc = await UserModel.findById(userId).select("legalName");
    const legalName = userDoc?.legalName;

    await ChatModel.findOneAndUpdate(
      { userId, chat_index: idx},
      {
        $push: {
          chat_content: {
            $each: [
              console.log(userName),
              { message: prompt,  sender: userName },
              { message: aiReply, sender: "AI"     },
            ],
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({aiReply :aiReply , userName : req.user.userName , legalName: legalName});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/chatHistory", authenticateToken, async (req, res) => {
  const docs = await ChatModel.find({ userId: req.user.id }).sort("chat_index");
  res.json(docs);
});

app.post("/postFullChatData", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const idx    = parseInt(req.body.chat_index, 10);
  const data   = req.body.chat_content;

  try {
    const doc = await ChatModel.findOneAndUpdate(
      { userId, chat_index: idx },
      { $set: { chat_content: data } },
      { new: true, upsert: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/getFullChatData", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const idx    = parseInt(req.body.chat_index, 10);

  try {
    const doc = await ChatModel.findOne(
      { userId, chat_index: idx },
      { _id: 0, chat_content: 1 }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc.chat_content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/setai", authenticateToken, (req, res) => {
  selected_ai = { name: req.body.name, description: req.body.description };
  res.status(200).json({ message: "AI has been successfully set" });
});

app.get("/getAiname", authenticateToken, (req, res) => {
  res.json({ message: selected_ai.name });
});

const UserSchema = new mongoose.Schema({
  userName:    { type: String, required: true, unique: true },
  passwordHash:{ type: String, required: true },
  legalName:   { type: String, required: true },
});
const UserModel = mongoose.model("users", UserSchema);

app.post("/signup", async (req, res) => {
  try {
    const { userName, password, legalName } = req.body;
    if (!userName || !password || !legalName)
      return res.status(400).json({ error: "All fields required" });

    if (await UserModel.findOne({ userName }))
      return res.status(409).json({ error: "Username taken" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ userName, passwordHash, legalName });

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(201).json({
      user: { id: user._id, userName: user.userName, legalName },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      return res.status(400).json({ error: "Missing credentials" });

    const user = await UserModel.findOne({ userName });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ user: { userName: user.userName }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});
