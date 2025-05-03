import React, { useState, useEffect} from "react";
import './App.css'
import axios from "axios"
// import llm from "./llm.jsx"


function App() {
  // 1) Match your API’s shape
  const [clientSideCache, setClientSideCache] = useState({user_prompts : [], ai_prompts : []})
  
  const [backendData, setBackendData] = useState({chats : {user_prompts : [], ai_responses : []} , history : 0});
  //front end data will always be an user prompt or user response
  const [FrontendData, setFrontendData] = useState('');
  const [chatHistories, setChatHistories] = useState([]);
  const history_index = 0

  const fetch_api = () =>{
    axios.get(`http://localhost:4000/api/?history=${history_index}`)
    .then(res => setBackendData({chats : res.data.chats, history : history_index}))
    .catch(err => console.log("there is an error: " + err))
  }

  const histories = () =>{
    axios.get(`http://localhost:4000/historyData`)
    .then(res => setChatHistories(res.data))
    .catch(err => console.log("there is an error: " + err))
  }

  useEffect(() =>{
    histories()
  }, []);

  const post_api = () =>{
    if(FrontendData.trim() !== ''){
      axios.post('http://localhost:4000/api', {chats : FrontendData.trim(), history : history_index})
      .then(res => {
        const ai_reply = res.data.Response
        setBackendData(prev => ({
          ...prev, 
          chats: {user_prompts : [...prev.chats.user_prompts , FrontendData.trim()] , ai_responses : [...prev.chats.ai_responses, ai_reply]}
        }))
        setFrontendData('')
        console.log(backendData)
        console.log(backendData.chats)
        fetch_api()
    })
    .catch(err => console.log(err))
  }}

  return (
    <div className="app">
      <div className="header"></div>
      <div className="side-bar">
        <h1 id="side-bar-header">Chats: </h1>
        <ul id="responses">
          {chatHistories?.map((element, index) =>(
            <li key={index}>{element.chats.user_prompts[0]}</li>
          ))}
        </ul>
      </div>

      <div className="body">
        <ul className="responses">
          {backendData.chats.user_prompts?.map((item, index) =>(
            <li key={index} className="user-prompt">{item}</li>
          ))}
          {backendData.chats.ai_responses?.map((element, index) =>(
            <li key={index} className="ai-response">{element}</li>
          ))}
        </ul>


        <div id="footer-search-bar">
          <textarea id="footer-search-bar-body" placeholder="Ask anything" onChange={e => setFrontendData(e.target.value)} value={FrontendData}></textarea>
          <div id="search-bar-submit">
            <div id="submit-button" onClick={() => post_api()}></div>
          </div>
        </div>
      </div>


    </div>
  );
} 

export default App;
