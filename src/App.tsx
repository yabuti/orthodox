import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyEmail from './components/VerifyEmail';
import Profile from './components/Profile';
import AuthService from './services/auth';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; language: 'en' | 'am' }> = ({ children, language }) => {
  if (!AuthService.isLoggedIn()) {
    return <Navigate to={`/${language}/login`} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/en/login" replace />} />
          
          {/* Auth Routes (public) */}
          <Route path="/en/login" element={<Login language="en" />} />
          <Route path="/en/signup" element={<Signup language="en" />} />
          <Route path="/en/verify" element={<VerifyEmail language="en" />} />
          <Route path="/am/login" element={<Login language="am" />} />
          <Route path="/am/signup" element={<Signup language="am" />} />
          <Route path="/am/verify" element={<VerifyEmail language="am" />} />
          
          {/* Protected English Routes */}
          <Route path="/en" element={
            <ProtectedRoute language="en">
              <HomePage language="en" />
            </ProtectedRoute>
          } />
          <Route path="/en/about" element={
            <ProtectedRoute language="en">
              <AboutUs language="en" />
            </ProtectedRoute>
          } />
          <Route path="/en/register" element={
            <ProtectedRoute language="en">
              <RegistrationForm language="en" />
            </ProtectedRoute>
          } />
          <Route path="/en/admin" element={
            <ProtectedRoute language="en">
              <AdminDashboard language="en" />
            </ProtectedRoute>
          } />
          <Route path="/en/profile" element={
            <ProtectedRoute language="en">
              <Profile language="en" />
            </ProtectedRoute>
          } />
          
          {/* Protected Amharic Routes */}
          <Route path="/am" element={
            <ProtectedRoute language="am">
              <HomePage language="am" />
            </ProtectedRoute>
          } />
          <Route path="/am/about" element={
            <ProtectedRoute language="am">
              <AboutUs language="am" />
            </ProtectedRoute>
          } />
          <Route path="/am/register" element={
            <ProtectedRoute language="am">
              <RegistrationForm language="am" />
            </ProtectedRoute>
          } />
          <Route path="/am/admin" element={
            <ProtectedRoute language="am">
              <AdminDashboard language="am" />
            </ProtectedRoute>
          } />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
