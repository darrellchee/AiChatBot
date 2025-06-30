import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginCSS from './unauth.module.css'  // or your shared CSS

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className={LoginCSS.mainContainer}>
      <h1 className={LoginCSS.heading1}>Unauthorized</h1>
      <div className={LoginCSS.body}>
      <p className={LoginCSS.para1}>
        You don’t have permission to view this page.
      </p>
      <button
        className={LoginCSS.continueButton}
        onClick={() => navigate('/login')}
      >
        Go to Login
      </button>
      </div>
    </div>
  )
}
