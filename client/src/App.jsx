import React, { useState, useEffect } from "react";

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
    <div>
      {backendData.users.length === 0
        ? <p>Loading…</p>
        : backendData.users.map((user, index) => (
            <p key={index}>{user}</p>
          ))
      }
    </div>
  );
}

export default App;
