import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FaHome, FaComment, FaUser, FaBars, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const settingsRef = useRef(null);
  const sidebarRef = useRef(null);
  const settingsButtonRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target) && !settingsButtonRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col p-2 transition-all duration-700 ease-in-out ${isExpanded ? "w-48" : "w-16"}`} ref={sidebarRef}>
      <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
        <FaBars size={20} className="mx-auto" />
      </button>
      <ul className="space-y-4 mt-4">
        <SidebarItem to="/" icon={<FaHome />} label="Home" isExpanded={isExpanded} />
        {user && <SidebarItem to="/chat" icon={<FaComment />} label="Chat" isExpanded={isExpanded} />}
        {!user && <SidebarItem to="/login" icon={<FaUser />} label="Login" isExpanded={isExpanded} />}
        <li className="relative">
          <button
            ref={settingsButtonRef}
            onClick={toggleSettings}
            className={`flex items-center p-2 rounded-md hover:bg-gray-700 transition w-full ${isExpanded ? "" : "pointer-events-none opacity-50"}`}
          >
            <FaCog size={20} className={`${showSettings ? "text-blue-500" : "text-white"}`} />
            <span className={`ml-3 transition-opacity duration-700 ease-in-out transform ${isExpanded ? "opacity-100 translate-x-0 delay-200" : "opacity-0 -translate-x-4"}`}>
              Settings
            </span>
          </button>
          {showSettings && (
            <div ref={settingsRef} className="absolute left-full top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-64 border dark:border-gray-700 text-black dark:text-white transition-all duration-500 ease-in-out z-20">
              <h2 className="text-lg font-semibold">Settings</h2>
              <DarkModeToggle />
              {user && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Currently logged in as:</p>
                  <p className="text-sm font-semibold break-all">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full p-3 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, isExpanded }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center p-2 rounded-md hover:bg-gray-700 transition ${!isExpanded ? "opacity-0 pointer-events-none" : ""}`}
    >
      {icon}
      <span className={`ml-3 transition-all duration-700 ease-in-out transform ${isExpanded ? "opacity-100 scale-100 translate-x-0 delay-150" : "opacity-0 scale-95 -translate-x-4"}`}>
        {label}
      </span>
    </Link>
  </li>
);

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      let darkModeEnabled = storedTheme ? storedTheme === "dark" : prefersDark;
      
      setDarkMode(darkModeEnabled);
      document.documentElement.classList.toggle("dark", darkModeEnabled);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="mt-4 flex items-center">
      <span className="mr-2 text-black dark:text-white">Dark Mode</span>
      <div
        className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition ${darkMode ? "bg-blue-500" : ""}`}
        onClick={() => setDarkMode((prev) => !prev)}
      >
        <div className={`bg-white dark:bg-gray-900 w-5 h-5 rounded-full shadow-md transform transition ${darkMode ? "translate-x-6" : ""}`} />
      </div>
    </div>
  );
};

export default Sidebar;