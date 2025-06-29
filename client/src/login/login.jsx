// import React, { useState, useEffect} from "react";
// import axios from "axios"
// import { useNavigate } from "react-router-dom";
import LoginCSS from "./login.module.css";
import { useNavigate } from 'react-router-dom';


function Login(){

    const navigate = useNavigate()
    
    const handleNagivateChat = () => {
        navigate('/');
    }

    const handleNagivateSignup = () => {
        navigate('/signup');
    }
    return(
        <div className={LoginCSS.mainContainer}>
            <div className={LoginCSS.heading1}>Sorry for</div>
            <div className={LoginCSS.heading1}>your time</div>
            <div className={LoginCSS.fieldsContainer}>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.heading1}>Welcome, Sorry</div>
                        <p className={LoginCSS.para1}>Please Login</p>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Username:</div>
                    <div>
                      <textarea className={LoginCSS.inputField} placeholder="DarrellChee123"></textarea>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Password:</div>
                    <div>
                        <textarea className={LoginCSS.inputField} placeholder="ilikethecolourblue123!"></textarea>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Legal Name:</div>
                    <div><textarea className={LoginCSS.inputField} placeholder="Jeremy Lim"></textarea></div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" />
                        <label htmlFor="agree1" className={LoginCSS.para}>My data will be collected</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" />
                        <label htmlFor="agree1" className={LoginCSS.para}>I agree with Darrell Chee</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className={LoginCSS.continueButton} onClick={() => handleNagivateChat()}>Continue</div>
                <div className={LoginCSS.signUp} onClick={() => handleNagivateSignup()}>Sign up instead</div>
            </div>
        </div>
    )
};

export default Login;