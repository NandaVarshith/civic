import './App.css'
import {Routes , Route} from 'react-router-dom'
import Dashboard from '../pages/dashboard/Dashboard'
import Analytics from '../pages/analytics/Analytics'
import Logout from '../pages/logout/Logout'
import Mapview from '../pages/mapview/Mapview'
import Myissues from '../pages/myissues/Myissues'
import Notifications from '../pages/notification/Notifications'
import Profile  from '../pages/profile/Profile'
import Raiseissue from '../pages/raiseissue/Raiseissue' 
import Register from  '../pages/authentication/Register'
import Login from  '../pages/authentication/Login'
import axios from 'axios'
import {useState , useEffect} from 'react'

function App() {

const [issues, setIssues] = useState([]);

const fetchIssues = async() =>{ 
      const response = await axios.get(`${import.meta.env.VITE_API_URL}api/issues`,{withCredentials:true});
      setIssues(response.data); 
  };

useEffect( () => {
  try{
    fetchIssues();
  }
    catch(error){
      console.log("Error fetching issues:", error);
    }
},[]);
  
  
  return (
    <>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard issues={issues} />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/mapview" element={<Mapview />} />
      <Route path="/myissues" element={<Myissues issues={issues} />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/raiseissue" element={<Raiseissue />} />
    </Routes>
      
    </>
  )
}

export default App
