import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginCSS from './login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (or if already logged in)
  const from = location.state?.from?.pathname || '/';

  // 1) If there's already a token, skip the form entirely
  const existingToken = localStorage.getItem('token');
  if (existingToken) {
    return <Navigate to={from} replace />;
  }

  const [userDetail, setUserDetail] = useState({
    userName: '',
    password: ''
  });
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [agreeDarrell, setAgreeDarrell] = useState(false);

  // Enable button only when all boxes checked and fields non-empty
  const canContinue =
    agreeData &&
    agreeDarrell &&
    userDetail.userName.trim() !== '' &&
    userDetail.password.trim() !== '';

  const handleLogin = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        userName: userDetail.userName,
        password: userDetail.password
      })
      .then((res) => {
        const { token } = res.data;
        if (token) {
          // 2a) Save token
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // 2b) Redirect to the protected page they wanted
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

  return (
    <div className={LoginCSS.mainContainer}>
      {/* …your existing JSX, unchanged… */}
      <button
        type="button"
        disabled={!canContinue}
        className={LoginCSS.continueButton}
        onClick={handleLogin}
      >
        Continue
      </button>
      <div className={LoginCSS.signUp} onClick={handleNavigateSignup}>
        Sign up instead
      </div>
    </div>
  );
}
