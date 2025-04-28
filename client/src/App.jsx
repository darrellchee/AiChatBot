import React, { useState, useEffect } from "react";
import './App.css'

function App() {
  // 1) Match your API’s shape
  const [backendData, setBackendData] = useState({ users: [] });

  useEffect(() => {
    fetch("/api")
      .then((r) => r.json())
      .then((data) => {
        console.log("got from server:", data);
        setBackendData(data);
      })
      .catch(console.error);
  }, []);

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
          <input id="footer-search-bar-body" placeholder="Ask anything"></input>
          <div id="search-bar-submit"></div>
        </div>
      </div>
    </div>
  );
} 

export default App;
