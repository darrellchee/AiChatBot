import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import HomeCSS from "./home.module.css";
import axios from 'axios';

function Home(){
    const [aiPresets , setAiPresets] = useState([])
    const [selectedAi, setSelectedAi] = useState(null)


    const fetch_ai_preset = () =>{
        axios.get("http://localhost:4000/getaipresets")
        .then(res => setAiPresets(res.data.message))
        .catch(err => console.log(err))
    }

    useEffect(()=>{
        fetch_ai_preset()
    }, [])

    return(
        <div className={HomeCSS.app}>
            <div className={HomeCSS.header}>
                <h1>Choose our Preset AIs:</h1>
                <p>im really just a chatgpt wrapper</p>
                {selectedAi && <h2 className={HomeCSS.selectedAi}>Selected AI: {selectedAi}</h2>}
            </div>
            <div className={HomeCSS.body}>
                <div className={HomeCSS.ai_preset_container}>
                    {aiPresets.map((preset, idx) =>{
                        const isActive = preset.name === selectedAi;
                        return(
                            <li key={idx} className={HomeCSS.aiPresets + (isActive ?` ${HomeCSS.aiPresetsActive}` : '')} onClick={() => setSelectedAi(preset.name)}>{preset.name}</li>
                        )
                    })}
                </div>
            </div>
        </div>
    )

}

export default Home;