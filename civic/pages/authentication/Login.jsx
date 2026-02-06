import React from 'react'
import './authentication.css'

function Login() {
  return (
    <>
      <div className="auth-container">
    <h1 className="logo">UrbanPulse</h1>
    <p className="tagline">Smart Civic Platform</p>

    <form className="auth-form"  action="/login" method="POST">
      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" required/>
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" required/>
      </div>

      <button type="submit">Login</button>
    </form>

    <p className="switch">
      Don’t have an account?
      <a href="register.html">Register</a>
    </p>
  </div>
    </>
  )
}

export default Login
