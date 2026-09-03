import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login } from '../../config/firebase'
const Login = () => {

  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (currState == "Sign Up") {
      signup(userName, email, password);
    }
    else {
      login(email, password);
    }
  }


  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign Up" ? <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder="Username" className="login-input" required /> : null}
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email address " className="login-input" required />
        <div className="password-input-wrapper">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="login-input"
            required
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login now"}</button>

        <div className="login-forgot">
          {
            currState === "Sign Up"
              ? <p className='login-toggle'>Already have an account  <span onClick={() => setCurrState("Login")}>Login here</span></p>
              : <p className='login-toggle'>Create an account <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          }
        </div>


      </form>
    </div>
  )
}

export default Login
