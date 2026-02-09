import React, { useState } from 'react'
import './authentication.css'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Assuming the API expects a POST request with email and password
      const response = await axios.post(`${apiUrl}/api/login`, formData);

      // TODO: Handle successful login, e.g., store token, user data in context/local storage
      console.log(response.data); // Log success message or user data

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "There was an error logging in!";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-container">
        <h1 className="logo">UrbanPulse</h1>
        <p className="tagline">Smart Civic Platform</p>

        <form className="auth-form" onSubmit={loginUser}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required />
          </div>

          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="switch">
          Don’t have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </>
  )
}

export default Login
