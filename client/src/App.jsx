import React, { useState, useEffect} from "react";
import './App.css'
import axios from "axios"
import llm from "./llm.jsx"


function App() {
  // 1) Match your API’s shape
  const [backendData, setBackendData] = useState({users : []});
  const [FrontendData, setFrontendData] = useState('');


  const fetch_api = () =>{
    axios.get('http://localhost:4000/api')
    .then(res => setBackendData({users : res.data.users}))
    .catch(err => console.log("there is an error: " + err))
  }

  useEffect(() =>{
    fetch_api()
  }, []);

  const post_api = () =>{
    axios.post('http://localhost:4000/api')
    .then(res => {
      setBackendData(prev => ({
        users: [...prev.users, FrontendData]
      }))
      res.json(backendData)  
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="app">
      <div className="header"></div>
      <div className="side-bar"></div>

      <div className="body">
        {backendData.users.length === 0
          ? <p>Loading…</p>
          : backendData.users.map((user, index) => (
              <p key={index}>{user}</p>
            ))
        }
      </div>

      <div className="footer">
        <div id="footer-search-bar">
          <input id="footer-search-bar-body" placeholder="Ask anything" onChange={e => setFrontendData(e.target.value)}></input>
          <div id="search-bar-submit" onClick={() => post_api()}></div>
        </div>
      </div>
    </div>
  );
} 

export default App;
