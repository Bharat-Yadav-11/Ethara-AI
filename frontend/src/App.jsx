import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

// --- PROTECTED ROUTE COMPONENT ---
// This checks if the user is logged in AND has the correct Role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center h-screen text-white bg-slate-900">Loading...</div>;
  
  // Not logged in? Go to Login
  if (!user) return <Navigate to="/login" />;

  // Wrong Role? Go Home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; 
  }

  return children;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={
        !user ? <Login /> : <Navigate to={user.role === 'HR' ? '/admin-dashboard' : '/employee-dashboard'} />
      } />
      
      {/* --- HR ONLY ROUTE --- */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['HR']}>
          <HRDashboard />
        </ProtectedRoute>
      } />

      {/* --- EMPLOYEE & HR ROUTE --- */}
      <Route path="/employee-dashboard" element={
        <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
          <EmployeeDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;