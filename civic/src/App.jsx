import './App.css'
import {Routes , Route} from 'react-router-dom'
import Dashboard from '../pages/dashboard/Dashboard'
import Analytics from '../pages/analytics/Analytics'
import Logout from '../pages/logout/Logout'
import Mapview from '../pages/mapview/Mapview'
import Myissues from '../pages/myissues/Myissues'
import Notification from '../pages/notification/Notifications'
import Profile  from '../pages/profile/Profile'
import Raiseissue from '../pages/raiseissue/Raiseissue' 

function App() {
  
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/mapview" element={<Mapview />} />
      <Route path="/myissues" element={<Myissues />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/raiseissue" element={<Raiseissue />} />
    </Routes>
      
    </>
  )
}

export default App
