import React, { useState, useEffect} from "react";
import './App.css'
import axios from "axios"
import { useNavigate } from "react-router-dom";

// import llm from "./llm.jsx"

//{chats : [{user_prompts : [], ai_responses : []}] , history : 0} history object
//{client_cache : clientSideCache, history_index : history_index}
function App() {
  // 1) Match your API’s shape
  const [clientSideCache, setClientSideCache] = useState([])
  const [chatHistories, setChatHistories] = useState([]);

  //front end data will always be an user prompt or user response
  const [FrontendData, setFrontendData] = useState('');

  const [history_index, setHistory_index] = useState(0);


  const [initial_user_prompt, setInitialUserPrompt] = useState(null)
  const [AiName, setAiName] = useState('');
  const nagivate = useNavigate()

  const histories = () =>{
    axios.get(`http://localhost:4000/chatHistory`)
    .then(res => {
      setChatHistories(res.data)
    })
    .catch(err => console.log("there is an error: " + err))
  }

  useEffect(() =>{
    histories();
    get_user_ai_chat(0);
    setHistory_index(0);
    get_ai_name();
    console.log(AiName)
  }, []);

  const get_ai_name = () =>{
    axios.get('http://localhost:4000/getAiname')
    .then(res => setAiName(res.data.message))
    .catch(err => console.log(err))
  }

  const get_user_ai_chat = (index) =>{
    console.log("user input: ", index)
    axios.post('http://localhost:4000/getFullChatData', {chat_index : index})
    .then(res => {
      console.log(res.data.response)
      setClientSideCache(res.data.response)
      console.log("get_user_ai success")
    })
    .catch(err => console.log(err))
  }

  const handle_change_ai = () =>{
    nagivate("/")
  }

  //{chats : [{user_prompts : [], ai_responses : []}] , history : 0} history object
  const post_api = () =>{
    if(FrontendData.trim() !== ''){
      setInitialUserPrompt(FrontendData.trim())
      setFrontendData('')
      console.log("front end data: ", FrontendData)
      axios.post('http://localhost:4000/api', {chat_content : FrontendData.trim(), chat_index : history_index})
      .then(res => {
        setInitialUserPrompt(null)
        const ai_reply = res.data.Response
        setClientSideCache(prev => {
          const merge = [...prev , FrontendData.trim(), ai_reply];
          post_user_ai_chat(merge);
          return merge
        })
        histories()
    })
    .catch(err => console.log(err))
  }
}

  const handle_submit = (e) =>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      post_api()
    }
  }
  //changes 
  const post_user_ai_chat = (updated) =>{
    axios.post('http://localhost:4000/postFullChatData', {chat_content : updated, chat_index : history_index})
    .then(res => console.log("good response"))
    .catch(err => console.log(err))
  }

  const handle_new_chat = () =>{
    if(clientSideCache.length === 0){
      console.log("Enter a prompt before making a new chat")
    }else{
      post_user_ai_chat(clientSideCache)
      const new_history_index = (chatHistories.at?.(-1).history ?? -1) + 1
      setHistory_index(new_history_index)
      setClientSideCache([])
      setInitialUserPrompt(null)
    }}

    //user response always delayed by 1 request refer to photo in gallery to see
  const handle_get_previous_chat = (input_index) =>{
    setInitialUserPrompt(null)
    get_user_ai_chat(input_index)
    setHistory_index(input_index)
  }

  return (
    <div className="app">
      <div className="header">
        <p className="ai-name" onClick={handle_change_ai}>Selected AI: {AiName}</p>
      </div>
      <div className="side-bar">
        <h1 className="side-bar-header">Chats: <div className="new-chat-icon" onClick={() => handle_new_chat()}>+</div></h1>
        <div id="responses">
          {chatHistories?.map((element, index) =>(
            <p key={index} className={element.history === history_index? "side-bar-histories active" : "side-bar-histories"} onClick={() => handle_get_previous_chat(element.chat_index)} >{element.chat_content[0]}</p> //side bar history
          ))}
        </div>
      </div>
        
      <div className="body">
      <div className="scroll-content">
        <ul className="responses"> 
          {clientSideCache?.map((item, index) =>{
            if(index % 2 === 0){
              return <li key={index} className="user-prompt">{item}</li>
            }else{
              return <li key={index} className="ai-response">{item}</li>
            }
            })}
          {initial_user_prompt && (
            <li className="user-prompt">{initial_user_prompt}</li>
          )}
        </ul> 
        </div>

        <div className={!clientSideCache || clientSideCache.length === 0 ? "footer initial" : "footer"}>
          <div id="footer-search-bar">
            <textarea id="footer-search-bar-body" placeholder="Ask anything" onChange={e => setFrontendData(e.target.value)} maxLength='150' value={FrontendData} onKeyDown={handle_submit}></textarea>
            <div id="search-bar-submit">
              <div id="submit-button" onClick={() => post_api()}></div>
            </div>  
          </div>
        </div>
      </div>


    </div>
  );
} 

export default App;
