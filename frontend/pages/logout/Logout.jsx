import React from 'react'
import Sidebar from '../../components/Sidebar';
import './Logout.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import CommonHeader from '../../components/CommonHeader';

function Logout() {

    const navigate = useNavigate();

    const logOut= async()=>{
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/';
        const response =  await axios.get(`${apiUrl}api/logout`, { withCredentials: true });
        navigate('/login');
    }
  return (      
   <>
       <div className="dashboard-container">
        <Sidebar />

        
        <main className="main-content">
            <CommonHeader title="Logout" />

            
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
