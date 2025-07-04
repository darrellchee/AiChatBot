// src/home/Home.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HomeCSS from "./home.module.css";
import Login from "../login/login";

function Home() {
  const [userName, setUserName] = useState('');
  const [aiPresets, setAiPresets] = useState([]);
  const [selectedAi, setSelectedAi] = useState(null);
  const [selectedAiDesc, setSelectedAiDesc] = useState(null);
  const [SelectedAiAuthor, setSelectedAiAuthor] = useState(null);
  const [newAi, setNewAi] = useState({});
  const [newFieldActive, setNewFieldActive] = useState(false);
  const [newAiErrorField, setNewAiErrorField] = useState(false);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const navigate = useNavigate();

  // Fetch presets
  const fetchAiPresets = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getaipresets`)
      .then((res) => {
        setAiPresets(res.data.message.aipresets)
        setUserName(res.data.message.userName)
    })
      .catch((err) => console.log(err));
  };

  // Post a new AI preset
  const postNewAi = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/postaipresets`, {
        name: newAi.name?.trim(),
        description: newAi.description,
      })
      .then((res) => setAiPresets(res.data.message))
      .catch((err) =>
        console.log("There is an error in posting the new ai: " + err)
      );
  };

  // Handler to show the “add new” fields
  const handleNewAi = () => {
    setNewFieldActive(true);
    setSelectedAi(null);
    setSelectedAiDesc(null);
    setSelectedAiAuthor(null);
  };

  // **Logout** handler
  const handleLogout = () => {
    // 1) Remove JWT
    localStorage.removeItem("token");
    // 2) Clear axios auth header
    delete axios.defaults.headers.common["Authorization"];
    // 3) Redirect to login (replace history)
    navigate("/login", { replace: true });
  };

  // Select/deselect an AI
const handleSelectAi = (preset) => {
  if (selectedAi === preset.name) {
    // you clicked the same one → clear everything
    setSelectedAi(null);
    setSelectedAiDesc(null);
    setSelectedAiAuthor(null);
  } else {
    // you clicked a new one → set all three together
    setSelectedAi(preset.name);
    setSelectedAiDesc(preset.description);
    setSelectedAiAuthor(preset.author);
  }
};

  // Enter submits new AI
  const handleSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const name = newAi.name?.trim();
      const des = newAi.description?.trim();
      const unique = aiPresets.some((el) => el.name === name);
      if (name && des && !unique) {
        postNewAi();
        setNewFieldActive(false);
        fetchAiPresets();
      } else {
        setNewAiErrorField(true);
        nameRef.current.focus();
      }
    }
  };

  // Move focus from name → description
  const handleDesc = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      descRef.current.focus();
    }
  };

  // Launch chat with selected AI
  const launchApp = () => {
    const idx = aiPresets.findIndex((e) => e.name === selectedAi);
    axios
      .post(`${process.env.REACT_APP_API_URL}/setai`, {
        name: aiPresets[idx].name,
        description: aiPresets[idx].description,
      })
      .then(() => navigate("/chat"))
      .catch((err) =>
        console.log("There is an error in launching the chat app: ", err)
      );
  };

  // Effects
  useEffect(fetchAiPresets, []);
  useEffect(fetchAiPresets, [newFieldActive]);
  useEffect(() => {
    if (newAiErrorField) {
      const timer = setTimeout(() => setNewAiErrorField(false), 700);
      return () => clearTimeout(timer);
    }
  }, [newAiErrorField]);

  return (
        <div className={HomeCSS.app}>
            <div className={HomeCSS.header}>
                <div className={HomeCSS.headerHeader}><p className={HomeCSS.headerHeaderp}>Logged in as {userName}</p><div className={HomeCSS.logout} onClick={e => handleLogout()}>Log out</div></div>
                <h1>Choose your AI:</h1>
                <p>im really just a chatgpt wrapper</p>
                {selectedAi && <h3 className={HomeCSS.selectedAi}>Selected AI: {selectedAi}<p className={HomeCSS.selectedAip}>Scroll Down Please</p></h3> }
            </div>
            <div className={HomeCSS.body}>
                <div className={HomeCSS.ai_preset_container}>
                    {aiPresets?.map((preset, idx) =>{
                        const isActive = preset.name === selectedAi;
                        return(
                            <li key={idx} className={HomeCSS.aiPresets + (isActive ?` ${HomeCSS.aiPresetsActive}` : '')} onClick={() => handleSelectAi(preset)}><div className="row">{preset.name}</div></li>
                        )
                    })}
                    <li className={(newAiErrorField ?` ${HomeCSS.setNewAiErrorField}` : `${HomeCSS.aiPresets}`)} onClick={() => handleNewAi()}>
                        <div className="row">
                        <p className={HomeCSS.newAddField  + (newFieldActive ?` ${HomeCSS.newAddFieldActive}` : '')}>Click to add</p>
                        <div className={HomeCSS.newAiField  + (newFieldActive ?` ${HomeCSS.newAiFieldActive}` : '')}>
                            <div className="row">
                            <p className={HomeCSS.aitext}>Give it a name:</p>
                            <input type="text" className={HomeCSS.newAiName} ref={nameRef} onChange={e => setNewAi(prev => ({...prev , name : e.target.value}))} onKeyDown={handleDesc} value={newAi.name}></input>
                            <p className={HomeCSS.aitext}>Set its behaviour (press enter):</p>
                            <textarea  className={HomeCSS.newAiDesc} ref={descRef} onChange={e => setNewAi(prev => ({...prev, description : e.target.value}))} onKeyDown={handleSubmit}></textarea>
                            </div>
                        </div>
                        </div>
                    </li>
                </div>
                {selectedAiDesc && <h2 className={HomeCSS.aiDescText}>Description: {selectedAiDesc}</h2>}
                {SelectedAiAuthor && <h2 className={HomeCSS.aiAuthText}>Made by: {SelectedAiAuthor}</h2>}
                <div className={HomeCSS.submitbutton + (selectedAi ?` ${HomeCSS.submitbuttonActive}` : '')} onClick={() => launchApp()}>Submit</div>
            </div>
        </div>
  );
}

export default Home;
