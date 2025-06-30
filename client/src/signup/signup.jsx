// import React, { useState, useEffect} from "react";
// import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LoginCSS from "./signup.module.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


function Signup(){
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate()
    const [agreeData, setAgreeData] = useState(false);
    const [agreeDarrell, setAgreeDarrell] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false);

    const canContinue = agreeData && agreeDarrell && userDetails.userName.trim() !== '' && userDetails.password.trim() !== '' && userDetails.legalName.trim() !== '';


    const handleNagivateChat = () => {
        navigate('/');
    }

    const handleNagivateLogin = () => {
        navigate('/login');
    }

    //res.json({ user: { userName: user.userName }, token })
    const handleNewUser = () =>{
        axios.post(`${process.env.REACT_APP_API_URL}/signup`, {userName : userDetails.userName, password : userDetails.password, legalName : userDetails.legalName})
        .then(res =>{
            console.log(res.data)
            handleNagivateChat()
        })
        .catch(err => console.log(userDetails))
    }
    
    return(
        <div className={LoginCSS.mainContainer}>
            <div className={LoginCSS.heading1}>Please signup</div>
            <div className={LoginCSS.heading1}>please</div>
            <div className={LoginCSS.fieldsContainer}>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.heading1}>Welcome, Sorry</div>
                        <p className={LoginCSS.para1}>Please Signup</p>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Username:</div>
                    <div>
                      <textarea className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="DarrellChee123" onChange={e => {setUserDetails(prev => ({...prev, userName : e.target.value}))}} value={userDetails.userName || ' '}></textarea>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Password:</div>
                    <div>
                        <textarea className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="Ilikeblue27" onChange={e => {setUserDetails(prev => ({...prev, password : e.target.value}))}} value={userDetails.password || ' '}></textarea>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Legal Name:</div>
                    <div><textarea className={LoginCSS.inputField} placeholder="Mylo Sujipto" onChange={e => {setUserDetails(prev => ({...prev, legalName : e.target.value}))}} value={userDetails.legalName || ' '}></textarea></div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" onChange={e => setAgreeData(e.target.checked)}/>
                        <label htmlFor="agree1" className={LoginCSS.para}>My data will be collected</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" onChange={e => setAgreeDarrell(e.target.checked)} />
                        <label htmlFor="agree1" className={LoginCSS.para}>I agree with Darrell Chee</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <button type="button" disabled={!canContinue} className={LoginCSS.continueButton} onClick={() => handleNewUser()}>Continue</button>
                <div className={LoginCSS.login} onClick={() => handleNagivateLogin()}>Login instead</div>
            </div>
        </div>
    )
};

export default Signup;