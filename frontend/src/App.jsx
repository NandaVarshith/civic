import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
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
import Assignissue from '../pages/assignissues/assignissue'
import IssueDetails from '../pages/worker/IssueDetails'

import axios from 'axios'
import {useState , useEffect} from 'react'

function ProtectedRoute({ user, loading }) {
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RoleRoute({ user, allowedRoles }) {
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

function Unauthorized() {
  return <div style={{ padding: 24 }}>403 Unauthorized</div>;
}

function App() {

const [issues, setIssues] = useState([]);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const bootstrap = async () => {
    try {
      const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/me`, { withCredentials: true });
      setUser(userResponse.data?.user || null);
      const issuesResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/issues`, { withCredentials: true });
      setIssues(Array.isArray(issuesResponse.data) ? issuesResponse.data : []);
    } catch (error) {
      setUser(null);
      setIssues([]);
      console.log("Error bootstrapping app:", error);
    } finally {
      setLoading(false);
    }
  };

  bootstrap();
}, []);

const roleHome = loading
  ? <div>Loading...</div>
  : !user
    ? <Navigate to="/login" replace />
    : user.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : user.role === "worker"
        ? <Navigate to="/worker/dashboard" replace />
        : <Navigate to="/user/dashboard" replace />;

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute user={user} loading={loading} />}>

        <Route element={<RoleRoute user={user} allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<Dashboard issues={issues} />} />
          <Route path="/user/analytics" element={<Analytics />} />
          <Route path="/user/logout" element={<Logout />} />
          <Route path="/user/mapview" element={<Mapview />} />
          <Route path="/user/myissues" element={<Myissues issues={issues} />} />
          <Route path="/user/notifications" element={<Notifications />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/raiseissue" element={<Raiseissue />} />
        </Route>

        <Route element={<RoleRoute user={user} allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard issues={issues} />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/logout" element={<Logout />} />
        <Route path="/admin/mapview" element={<Mapview />} />
        <Route path="/admin/myissues" element={<Myissues issues={issues} />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/assign/:id" element={<Assignissue />} />
        </Route>

        <Route element={<RoleRoute user={user} allowedRoles={["worker"]} />}>
          <Route path="/worker/dashboard" element={<Dashboard issues={issues} />} />
        <Route path="/worker/analytics" element={<Analytics />} />
        <Route path="/worker/logout" element={<Logout />} />
        <Route path="/worker/mapview" element={<Mapview />} />
        <Route path="/worker/myissues" element={<Myissues issues={issues} />} />
        <Route path="/worker/issues/:id" element={<IssueDetails />} />
        
        <Route path="/worker/notifications" element={<Notifications />} />
        <Route path="/worker/profile" element={<Profile />} />
      </Route>
      </Route>

      <Route path="/" element={roleHome} />
      <Route path="/dashboard" element={roleHome} />
      <Route path="/analytics" element={roleHome} />
      <Route path="/logout" element={roleHome} />
      <Route path="/mapview" element={roleHome} />
      <Route path="/myissues" element={roleHome} />
      <Route path="/notifications" element={roleHome} />
      <Route path="/profile" element={roleHome} />
      <Route path="/raiseissue" element={roleHome} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
