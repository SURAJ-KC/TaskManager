import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddContactForm from "../form/AddContactForm/AddContactForm";
import RightLog from "../log/RightLog";
import { logoutUser } from "../../Utils/auth";
import Navbar from "../navigation/Navbar";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // 1. Track authentication status based on existing token
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken") || !!localStorage.getItem("token")
  );

  // Key state used to trigger a re-fetch in RightLog
  const [refreshKey, setRefreshKey] = useState(0);

  // 2. Sync token state if it changes or gets deleted
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Listen for storage events (e.g. token cleared on logout or expiry)
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    logoutUser(); // Call your existing logout utility
    setIsAuthenticated(false); // Update local state immediately
    navigate("/login"); // Redirect user to Login page
  };

  const handleContactChange = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col gap-6">
        {/* Workspace Banner */}
        <header className="glass-card w-full p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contact Manager Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Full CRUD: Create, View, Edit, and Delete your protected contacts
            </p>
          </div>

          {/* 3. Conditional Button: Shows 'Log Out' if logged in, 'Login' if expired/logged out */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer text-center"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/30 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer text-center"
            >
              Login
            </Link>
          )}
        </header>

        {/* Responsive Grid Layout for CRUD Workspace */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Create Contact Form */}
          <section className="lg:col-span-5 w-full">
            <AddContactForm onContactAdded={handleContactChange} />
          </section>

          {/* Right Column: Read, Edit, & Delete Contact List */}
          <section className="lg:col-span-7 w-full">
            <RightLog key={refreshKey} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;