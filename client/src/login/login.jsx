// src/login/login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginCSS from './login.module.css';

export default function Login() {
  // 1️⃣ Always call hooks first, no early returns before these:
  const navigate = useNavigate();
  const location = useLocation();

  const [userDetail, setUserDetail] = useState({
    userName: '',
    password: ''
  });
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [agreeDarrell, setAgreeDarrell] = useState(false);

  // 2️⃣ Compute derived values
  const from = location.state?.from?.pathname || '/';
  const canContinue =
    agreeData &&
    agreeDarrell &&
    userDetail.userName.trim() !== '' &&
    userDetail.password.trim() !== '';

  // 3️⃣ Then do your conditional redirect
  const existingToken = localStorage.getItem('token');
  if (existingToken) {
    return <Navigate to={from} replace />;
  }

  // 4️⃣ Event handlers
  const handleLogin = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        userName: userDetail.userName,
        password: userDetail.password
      })
      .then((res) => {
        const { token } = res.data;
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigate(from, { replace: true });
        } else {
          setInvalidLogin(true);
        }
      })
      .catch(() => setInvalidLogin(true));
  };

  const handleNavigateSignup = () => {
    navigate('/signup');
  };

  // 5️⃣ And finally your JSX
    return (
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
                <div className="row">
                    <div className={LoginCSS.heading2}>Username:</div>
                    <div>
                      <textarea className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="DarrellChee123" onChange={e => {setUserDetail(prev => ({...prev, userName : e.target.value}))}} value={userDetail.userName || ''}></textarea>
                      <p className={invalidLogin?`${LoginCSS.textBelowInputs} ${LoginCSS.textBelowInputsActive}` :  `${LoginCSS.textBelowInputs}`}>Invalid Credentials</p>
                    </div>
                </div>
                <div className="row">
                    <div className={LoginCSS.heading2}>Password:</div>
                    <div>
                        <textarea className={invalidLogin?`${LoginCSS.inputField} ${LoginCSS.inputFieldActive}` : `${LoginCSS.inputField}`} placeholder="DarrellChee123" onChange={e => {setUserDetail(prev => ({...prev, password : e.target.value}))}} value={userDetail.password || ''}></textarea>
                        <p className={invalidLogin?`${LoginCSS.textBelowInputs} ${LoginCSS.textBelowInputsActive}` : `${LoginCSS.textBelowInputs}`}>Invalid Credentials</p>
                    </div>
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
                        <input type="checkbox" id="agree2" onChange={e => setAgreeDarrell(e.target.checked)} />
                        <label htmlFor="agree2" className={LoginCSS.para}>I agree with Darrell Chee</label>
                        </div>
                    </div>
                </div>
                <div className={LoginCSS.partition1}></div>
                <button type="button" disabled={!canContinue} className={LoginCSS.continueButton} onClick={() => handleLogin()}>Continue</button>
                <div className={LoginCSS.signUp} onClick={handleNavigateSignup}>Sign up instead</div>
            </div>
        </div>
    );

}
