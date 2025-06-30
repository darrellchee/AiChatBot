import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [clientSideCache, setClientSideCache] = useState([]);  
  const [chatHistories, setChatHistories] = useState([]);
  const [FrontendData, setFrontendData]   = useState("");
  const [historyIndex, setHistoryIndex]   = useState(0);
  const [AiName, setAiName]               = useState("");
  const navigate                          = useNavigate();

  // load all history indexes
  const fetchHistories = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/chatHistory`)
      .then((res) => setChatHistories(res.data))
      .catch(console.error);
  };

  // load one chat’s messages (array of {message,sender,ts})
  const getUserAiChat = (index) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/getFullChatData`, {
        chat_index: index,
      })
      .then((res) => setClientSideCache(res.data))
      .catch(console.error);
  };

  // load selected AI name
  const getAiName = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getAiname`)
      .then((res) => setAiName(res.data.message))
      .catch(console.error);
  };

  useEffect(() => {
    fetchHistories();
    getUserAiChat(0);
    setHistoryIndex(0);
    getAiName();
  }, []);

  const postApi = () => {
    const prompt = FrontendData.trim();
    if (!prompt) return;
    setClientSideCache((prev) => [...prev, prompt]);
    setFrontendData("");

    axios
      .post(`${process.env.REACT_APP_API_URL}/api`, {
        chat_content: prompt,
        chat_index: historyIndex,
      })
      .then((res) => {
        const aiReply = res.data.aiReply;
        const userNa = res.data.userName;
        const legalName = res.data.legalName;
        // build two entries
        const newEntries = [
          { message: legalName + ": \n\n" + prompt, sender: `User: ${userNa}` },
          { message: AiName + ": \n\n" + aiReply, sender: `AI: ${AiName}` },
        ];
        setClientSideCache(prev => prev.slice(0, -1));
        setClientSideCache((prev) => {
          const merged = [...prev, ...newEntries];
          // save merged back to DB
          axios.post(`${process.env.REACT_APP_API_URL}/postFullChatData`, {
            chat_content: merged,
            chat_index: historyIndex,
          });
          return merged;
        });
        fetchHistories();
      })
      .catch(console.error);
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postApi();
    }
  };

  const handleNewChat = () => {
    if (clientSideCache.length === 0) {
      console.log("Enter a prompt before making a new chat");
      return;
    }
    const newIdx = (chatHistories.at?.(-1)?.chat_index ?? -1) + 1;
    setHistoryIndex(newIdx);
    setClientSideCache([]);
  };

  const handleGetPreviousChat = (idx) => {
    setHistoryIndex(idx);
    getUserAiChat(idx);
  };

  return (
    <div className="app">
      <div className="header">
        <p className="ai-name" onClick={() => navigate("/")}>
          Selected AI: {AiName} (click to go back)
        </p>
      </div>

      <div className="side-bar">
        <h1 className="side-bar-header">
          Chats:{" "}
          <div className="new-chat-icon" onClick={handleNewChat}>
            +
          </div>
        </h1>
        <div id="responses">
          {chatHistories.map((h) => (
            <p
              key={h.chat_index}
              className={
                h.chat_index === historyIndex
                  ? "side-bar-histories active"
                  : "side-bar-histories"
              }
              onClick={() => handleGetPreviousChat(h.chat_index)}
            >
            { h.chat_content[0]?.message?.slice(8, 8 + 20) ?? "New Chat" }            
            </p>
          ))}
        </div>
      </div>

      <div className="body">
        <div className="scroll-content">
          <ul className="responses">
            {clientSideCache.map((entry, i) => (
              <li
                key={i}
                className={
                  i%2 == 0 ? "user-prompt" : "ai-response"
                }
              >
                {entry.message}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={
            clientSideCache.length === 0 ? "footer initial" : "footer"
          }
        >
          <div id="footer-search-bar">
            <textarea
              id="footer-search-bar-body"
              placeholder="Ask anything"
              value={FrontendData}
              maxLength={1000}
              onChange={(e) => setFrontendData(e.target.value)}
              onKeyDown={handleSubmit}
            />
            <div id="search-bar-submit">
              <div id="submit-button" onClick={postApi}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
