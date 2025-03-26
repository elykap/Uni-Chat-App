import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth(); // Get authentication state

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to the Chat App</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Connect with your university peers in real time.</p>

      <Link
        to={user ? "/chat" : "/register"}
        className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        {user ? "Go to Chat" : "Get Started"}
      </Link>
    </div>
  );
};

export default HomePage;