import React from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Logout.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Logout() {

    const navigate = useNavigate();

    const logOut= async()=>{
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response =  await axios.get(`${apiUrl}/api/logout`, { withCredentials: true });
        navigate('/login');
    }
  return (      
   <>
       <div className="dashboard-container">
        <Sidebar />

        
        <main className="main-content">
            <header className="top-header">
                <div className="header-left">
                    <h2>Logout</h2>
                    <nav className="breadcrumb">
                        <Link to="/dashboard">Dashboard</Link> / <span>Logout</span>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="user-avatar">
                        <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar"/>
                    </div>
                </div>
            </header>

            
            <div className="logout-container">
                <div className="logout-card">
                    <div className="logout-icon">
                        <span>&#128682;</span>
                    </div>
                    <h2>Are you sure you want to logout?</h2>
                    <p>You will be redirected to the login page.</p>
                    <div className="logout-actions">
                        <button onClick={logOut} className="btn btn-confirm">Confirm Logout</button>
                        <button className="btn btn-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
   </>
  )
}

export default Logout
