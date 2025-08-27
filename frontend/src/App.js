// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './components/dashboard/Calendar.css';

// --- (1) IMPORT GALAXY ---
import Galaxy from './components/Aurora'; // Adjust path if necessary

// Import Theme Provider and Hook
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Import Page Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AllTasksPage from './pages/AllTasksPage';

function AppContent() {
  const { theme } = useTheme();

  return (
    // --- (2) ADD A NEW MAIN WRAPPER ---
    // This wrapper establishes the stacking context (`relative`) and a fallback background color.
    <div className="relative bg-black">
      
      {/* --- (3) ADD THE GALAXY BACKGROUND --- */}
      {/* This is fixed to the viewport and sits behind everything with a negative z-index. */}
      <div className="fixed inset-0 -z-10">
        <Galaxy />
      </div>

      {/* --- (4) MODIFY THE ORIGINAL LAYOUT CONTAINER --- */}
      {/* 
        - We REMOVED `bg-white dark:bg-gray-900` to make it transparent.
        - We ADDED `relative z-10` to ensure it sits ON TOP of the Galaxy background.
      */}
      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Private Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <AllTasksPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>

      {/* The ToastContainer remains outside, as it's an overlay. This is correct. */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme={theme}
      />
    </div>
  );
}


function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;