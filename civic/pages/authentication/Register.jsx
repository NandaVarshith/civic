import React, { useState } from 'react'
import './authentication.css'
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom'; 

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role value, matches the <option> value
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.role || formData.role === "") {
      setError("Please select a role.");
      setLoading(false);
      return;
    }

    try {
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/register`, formData);
      
      setSuccess(response.data.message);
      console.log(response.data);
      
       setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "There was an error registering the user!";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <h1 className="logo">UrbanPulse</h1>
        <p className="tagline">Create an account</p>

        <form className="auth-form" onSubmit={registerUser}>
          {error && <p style={{color: 'red'}}>{error}</p>}
          {success && <p style={{color: 'green'}}>{success}</p>}

          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select role</option>
              <option value="user">Citizen</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="switch">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  )
}

export default Register
