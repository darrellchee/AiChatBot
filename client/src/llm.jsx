import React, {useState, useEffect, use} from "react";
import axios from "axios";

function llm(){
    const[userinput, setUserInput] = useState('')
    const[chat, setChat] = useState([])

    const render_page = async() =>{
        const response = ""
        await axios.get("http://localhost:4000/llm")
        .then(res => response = res.body.message)
        setChat(response)
        .catch(err => json.status(404).json({"error: " : err}))
    }

    useEffect(()=>{
        render_page()
    }, []);
    
    const send_request = async () =>{
        await axios.post("http://localhost:4000/llm")
        .then(res.json({"message" : userinput}))
        userinput = ''
        .catch(err => res.status(401).json({"There is an error: " : err}))
    }

    return(
        <div>
            <div id="chat-history">
                {chat.map((e, i) =>{
                    <p key={i}>{e}</p>
                })}
            </div>
            <input onChange={e => setUserInput(e.target.value)} placeholder="Your request" value={userinput}></input>
            <button onClick={() => send_request()}></button>
        </div>
    )
}

export default llm;