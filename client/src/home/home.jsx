import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import HomeCSS from "./home.module.css";
import axios from 'axios';

function Home(){
    const [aiPresets , setAiPresets] = useState([])
    const [selectedAi, setSelectedAi] = useState(null)
    // newAi = {name: '', description:''}
    const [newAi, setNewAi] = useState({})
    const [newFieldActive, setnewFieldActive] = useState(false)
    const [newAierrorField, setnewAierrorField] = useState(false)
    const nameRef = useRef(null)
    const descRef = useRef(null)
    const navigate = useNavigate()

    const fetch_ai_preset = () =>{
        axios.get("http://localhost:4000/getaipresets")
        .then(res => setAiPresets(res.data.message))
        .catch(err => console.log(err))
    }

    const post_new_ai = () =>{
        axios.post("http://localhost:4000/postaipresets" , {name : newAi.name?.trim(), description : newAi.description})
        .then(res => setAiPresets(res.data.message))
        .catch(err => console.log("There is an error in posting the new ai: " + err))
    }
    
    const handleNewAi = () =>{
        setnewFieldActive(true)
        if(selectedAi){
            setSelectedAi(null)
        }
    }

    const handleSelectAi = (input) =>{
        if(selectedAi == input){
            setSelectedAi(null)
        }else{
            setSelectedAi(input)
        }
    }

    const handleSubmit = (e) =>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            const name = newAi.name?.trim()
            const des = newAi.description?.trim()
            const unique = aiPresets.some(element => element.name === name);
            if(name && des && !unique){
                post_new_ai()
                setnewFieldActive(false)
            }else{
                setnewAierrorField(true)
                nameRef.current.focus();
            }
        }
    }

    const handleDesc = (e) =>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            descRef.current.focus();
        }
    }

    const launchApp = () =>{
        const ai_input = aiPresets?.findIndex(e => e.name === selectedAi)
        axios.post("http://localhost:4000/setai" , {name : aiPresets[ai_input].name, description : aiPresets[ai_input].description})
        .then(res => {
            console.log(res.data.message)
            navigate('/chat')
        })
        .catch(err => console.log("there is an error in launching the chat app: ", err))
    }


    useEffect(()=>{
        fetch_ai_preset()
    }, [])

    useEffect(()=>{
        fetch_ai_preset()
    }, [newFieldActive])

    useEffect(() =>{
        setTimeout(() =>{
            if(newAierrorField === true){
                setnewAierrorField(false)
            }
        }, 700)
    }, [newAierrorField])

    return(
        <div className={HomeCSS.app}>
            <div className={HomeCSS.header}>
                <h1>Choose our Preset AIs:</h1>
                <p>im really just a chatgpt wrapper</p>
                {selectedAi && <h2 className={HomeCSS.selectedAi}>Selected AI: {selectedAi}</h2>}
            </div>
            <div className={HomeCSS.body}>
                <div className={HomeCSS.ai_preset_container}>
                    {aiPresets?.map((preset, idx) =>{
                        const isActive = preset.name === selectedAi;
                        return(
                            <li key={idx} className={HomeCSS.aiPresets + (isActive ?` ${HomeCSS.aiPresetsActive}` : '')} onClick={() => handleSelectAi(preset.name)}>{preset.name}</li>
                        )
                    })}
                    <li className={(newAierrorField ?` ${HomeCSS.setNewAiErrorField}` : `${HomeCSS.aiPresets}`)} onClick={() => handleNewAi()}>
                        <p className={HomeCSS.newAddField  + (newFieldActive ?` ${HomeCSS.newAddFieldActive}` : '')}>Click to add</p>
                        <div className={HomeCSS.newAiField  + (newFieldActive ?` ${HomeCSS.newAiFieldActive}` : '')}>
                            <div>
                                <p>Give it a name:</p>
                                <textarea className={HomeCSS.newAiName} ref={nameRef} onChange={e => setNewAi(prev => ({...prev , name : e.target.value}))} onKeyDown={handleDesc} value={newAi.name}></textarea>
                            </div>
                            <div>
                                <p>Tell it how it behaves:</p>
                                <textarea className={HomeCSS.newAiDesc} ref={descRef} onChange={e => setNewAi(prev => ({...prev, description : e.target.value}))} onKeyDown={handleSubmit}></textarea>
                            </div>
                        </div>
                    </li>
                </div>
                <div className={HomeCSS.submitbutton + (selectedAi ?` ${HomeCSS.submitbuttonActive}` : '')} onClick={() => launchApp()}>Submit</div>
            </div>
        </div>
    )
    // newAi = {name: '', description:''}

}

export default Home;