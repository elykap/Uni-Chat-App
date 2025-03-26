import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterForm from "./components/RegisterForm";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <div className="dark:bg-gray-900 dark:text-white flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 h-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/chat"
            element={
              user && user.emailVerified ? <Chat /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;