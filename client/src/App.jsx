import React, { useState, useEffect} from "react";
import './App.css'
import axios from "axios"
// import llm from "./llm.jsx"


function App() {
  // 1) Match your API’s shape
  const [backendData, setBackendData] = useState({chats : [] , history : 0});
  const [FrontendData, setFrontendData] = useState('');

  const [chatHistories, setChatHistories] = useState([]);

  const history_index = 0

  const fetch_api = () =>{
    axios.get(`http://localhost:4000/api/?history=${history_index}`)
    .then(res => setBackendData({chats : [res.data], history : history_index}))
    .catch(err => console.log("there is an error: " + err))
  }

  const histories = () =>{
    axios.get(`http://localhost:4000/historyData`)
    .then(res => setChatHistories(res))
    .catch(err => console.log("there is an error: " + err))
  }

  useEffect(() =>{
    fetch_api()
    histories()
  }, []);

  const post_api = () =>{
    axios.post('http://localhost:4000/api', {message : backendData})
    .then(res => {
      setBackendData(prev => ({
        ...prev, 
        chats: [...prev.chats, FrontendData]
      }))
      setFrontendData('')
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="app">
      <div className="header"></div>
      <div className="side-bar">
        <h1 id="side-bar-header">Chats: </h1>
        <ul id="responses">
          {chatHistories.chats?.map((e, index) =>(
          <li key={index}>{e[0]}</li>
          ))}
        </ul>
      </div>

      <div className="body">
        <ul className="responses">
            {backendData.chats?.map((chat, index) => (
            <li key={index} className="user-prompt">{chat}</li>
              ))
            }
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
