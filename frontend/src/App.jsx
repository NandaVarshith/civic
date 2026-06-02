import './App.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import axios from 'axios'
import {useState , useEffect} from 'react'

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Analytics = lazy(() => import('../pages/analytics/Analytics'))
const Logout = lazy(() => import('../pages/logout/Logout'))
const Mapview = lazy(() => import('../pages/mapview/Mapview'))
const Myissues = lazy(() => import('../pages/myissues/Myissues'))
const Notifications = lazy(() => import('../pages/notification/Notifications'))
const Profile = lazy(() => import('../pages/profile/Profile'))
const Raiseissue = lazy(() => import('../pages/raiseissue/Raiseissue'))
const Register = lazy(() => import('../pages/authentication/Register'))
const Login = lazy(() => import('../pages/authentication/Login'))
const Assignissue = lazy(() => import('../pages/assignissues/Assignissue'))
const IssueDetails = lazy(() => import('../pages/worker/IssueDetails'))

const LoadingSpinner = () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

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

const bootstrap = async () => {
  setLoading(true);
  try {
    const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/me`, { withCredentials: true });
    setUser(userResponse.data?.user || null);
    const issuesResponse = await axios.get(`${import.meta.env.VITE_API_URL}api/issues`, { withCredentials: true });
    setIssues(Array.isArray(issuesResponse.data) ? issuesResponse.data : []);
    return userResponse.data?.user || null;
  } catch (error) {
    setUser(null);
    setIssues([]);
    console.log("Error bootstrapping app:", error);
    return null;
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
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
      <Route path="/register" element={<Suspense fallback={<LoadingSpinner />}><Register /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<LoadingSpinner />}><Login onLoginSuccess={bootstrap} /></Suspense>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute user={user} loading={loading} />}>

        <Route element={<RoleRoute user={user} allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard issues={issues} /></Suspense>} />
          <Route path="/user/analytics" element={<Suspense fallback={<LoadingSpinner />}><Analytics issues={issues} /></Suspense>} />
          <Route path="/user/logout" element={<Suspense fallback={<LoadingSpinner />}><Logout /></Suspense>} />
          <Route path="/user/mapview" element={<Suspense fallback={<LoadingSpinner />}><Mapview /></Suspense>} />
          <Route path="/user/myissues" element={<Suspense fallback={<LoadingSpinner />}><Myissues issues={issues} /></Suspense>} />
          <Route path="/user/notifications" element={<Suspense fallback={<LoadingSpinner />}><Notifications /></Suspense>} />
          <Route path="/user/profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
          <Route path="/user/raiseissue" element={<Suspense fallback={<LoadingSpinner />}><Raiseissue /></Suspense>} />
        </Route>

        <Route element={<RoleRoute user={user} allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard issues={issues} /></Suspense>} />
          <Route path="/admin/analytics" element={<Suspense fallback={<LoadingSpinner />}><Analytics issues={issues} /></Suspense>} />
        <Route path="/admin/logout" element={<Suspense fallback={<LoadingSpinner />}><Logout /></Suspense>} />
        <Route path="/admin/mapview" element={<Suspense fallback={<LoadingSpinner />}><Mapview /></Suspense>} />
        <Route path="/admin/myissues" element={<Suspense fallback={<LoadingSpinner />}><Myissues issues={issues} /></Suspense>} />
        <Route path="/admin/notifications" element={<Suspense fallback={<LoadingSpinner />}><Notifications /></Suspense>} />
        <Route path="/admin/profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
        <Route path="/admin/assign/:id" element={<Suspense fallback={<LoadingSpinner />}><Assignissue /></Suspense>} />
        </Route>

        <Route element={<RoleRoute user={user} allowedRoles={["worker"]} />}>
          <Route path="/worker/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard issues={issues} /></Suspense>} />
        <Route path="/worker/analytics" element={<Suspense fallback={<LoadingSpinner />}><Analytics issues={issues} /></Suspense>} />
        <Route path="/worker/logout" element={<Suspense fallback={<LoadingSpinner />}><Logout /></Suspense>} />
        <Route path="/worker/mapview" element={<Suspense fallback={<LoadingSpinner />}><Mapview /></Suspense>} />
        <Route path="/worker/myissues" element={<Suspense fallback={<LoadingSpinner />}><Myissues issues={issues} /></Suspense>} />
        <Route path="/worker/issues/:id" element={<Suspense fallback={<LoadingSpinner />}><IssueDetails /></Suspense>} />

        <Route path="/worker/notifications" element={<Suspense fallback={<LoadingSpinner />}><Notifications /></Suspense>} />
        <Route path="/worker/profile" element={<Suspense fallback={<LoadingSpinner />}><Profile /></Suspense>} />
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
