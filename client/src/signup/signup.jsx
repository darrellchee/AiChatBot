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
    const handleNewUser = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
        userName: userDetails.userName,
        password: userDetails.password,
        legalName: userDetails.legalName
    })
    .then(res => {
        const { token } = res.data;
        if (token) {
        // store & set the JWT
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // go straight to the app (bypassing login)
        navigate('/', { replace: true });
        } else {
        // if you want, flag an error here
        setInvalidLogin(true);
        }
    })
    .catch(err => {
        console.error(err);
        setInvalidLogin(true);
    });
    };

    
    return(
        <div className={LoginCSS.mainContainer}>
            <div className={LoginCSS.heading1}>Happy to</div>
            <div className={LoginCSS.heading1}>see you</div>
            <div className={LoginCSS.fieldsContainer}>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.heading1}>Nice to meet you!</div>
                        <p className={LoginCSS.para1}>Please Signup</p>
                    </div>
                </div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Username:</div>
                    <div>
                      <input type="text" className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="Darrell" onChange={e => {setUserDetails(prev => ({...prev, userName : e.target.value}))}} value={userDetails.userName || ''}></input>
                    </div>
                </div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Password:</div>
                    <div>
                        <input type="password" className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="********" onChange={e => {setUserDetails(prev => ({...prev, password : e.target.value}))}} value={userDetails.password || ''}></input>
                    </div>
                </div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Legal Name:</div>
                    <div><input type="text" className={LoginCSS.inputField} placeholder="Samuel Jason Firmanysah" onChange={e => {setUserDetails(prev => ({...prev, legalName : e.target.value}))}} value={userDetails.legalName || ''}></input></div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" onChange={e => setAgreeData(e.target.checked)}/>
                        <label htmlFor="agree1" className={LoginCSS.para}>Log in data will be encrypted</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <div className="row">
                    <div className="col">
                        <div className={LoginCSS.checkBoxRow}>
                        <input type="checkbox" id="agree1" onChange={e => setAgreeDarrell(e.target.checked)} />
                        <label htmlFor="agree1" className={LoginCSS.para}>My chat data will be collected</label>
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