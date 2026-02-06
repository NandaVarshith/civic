import React from 'react'
import './authentication.css'

function Register() {
  return (
    <>
      <div className="auth-container">
    <h1 className="logo">UrbanPulse</h1>
    <p className="tagline">Create an account</p>

    <form className="auth-form" action="/register" method="POST">
      <div className="field">
        <label>Full Name</label>
        <input type="text" placeholder="Enter your name" required/>
      </div>

      <div className="field">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" required/>
      </div>

      <div className="field">
        <label>Password</label>
        <input type="password" placeholder="Create a password" required/>
      </div>

      <div className="field">
        <label>Role</label>
        <select required>
          <option value="">Select role</option>
          <option>Citizen</option>
          <option>Officer</option>
          <option>Admin</option>
        </select>
      </div>

      <button type="submit">Register</button>
    </form>

    <p className="switch">
      Already have an account?
      <a href="login.html">Login</a>
    </p>
  </div>
    </>
  )
}

export default Register
