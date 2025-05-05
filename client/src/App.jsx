import React, { useState, useEffect} from "react";
import './App.css'
import axios from "axios"
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


  const histories = () =>{
    axios.get(`http://localhost:4000/historyData`)
    .then(res => setChatHistories(res.data))
    .catch(err => console.log("there is an error: " + err))
  }

  useEffect(() =>{
    histories();
    get_user_ai_chat(0);
    setHistory_index(0);
  }, []);


  const get_user_ai_chat = (index) =>{
    console.log("user input: ", index)
    axios.post('http://localhost:4000/getFullChatData', {history_index : index})
    .then(res => {
      console.log(res.data.response)
      setClientSideCache(res.data.response)
      console.log("get_user_ai success")
    })
    .catch(err => console.log(err))
  }

  //{chats : [{user_prompts : [], ai_responses : []}] , history : 0} history object
  const post_api = () =>{
    if(FrontendData.trim() !== ''){
      console.log("front end data: ", FrontendData)
      axios.post('http://localhost:4000/api', {chats : FrontendData.trim(), history : history_index})
      .then(res => {
        const ai_reply = res.data.Response
        setClientSideCache(prev => {
          const merge = [...prev , FrontendData.trim(), ai_reply];
          post_user_ai_chat(merge);
          return merge
        })
        setFrontendData('')
        histories()
    })
    .catch(err => console.log(err))
  }
}


  //changes 
  const post_user_ai_chat = (updated) =>{
    axios.post('http://localhost:4000/postFullChatData', {client_cache : updated, history_index : history_index})
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
    }}

    //user response always delayed by 1 request refer to photo in gallery to see
  const handle_get_previous_chat = (input_index) =>{
    get_user_ai_chat(input_index)
    setHistory_index(input_index)
  }

  return (
    <div className="app">
      <div className="header"></div>
      <div className="side-bar">
        <h1 id="side-bar-header">Chats: <div className="new-chat-icon" onClick={() => handle_new_chat()}>+</div></h1>
        <div id="responses">
          {chatHistories?.map((element, index) =>(
            <p key={index} className="side-bar-histories" onClick={() => handle_get_previous_chat(element.history)} >{element.chats.user_prompts[0]}</p> //side bar history
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
        </ul> 
        </div>

        <div className="footer">
          <div id="footer-search-bar">
            <textarea id="footer-search-bar-body" placeholder="Ask anything" onChange={e => setFrontendData(e.target.value)} maxLength='150' value={FrontendData}></textarea>
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
