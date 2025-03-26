import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      // **Force sign out immediately after registration** so they must verify before logging in
      await signOut(auth);

      navigate("/login", { state: { message: "Registration successful! Please check your email to verify your account before logging in." } });
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        {message && <p className="text-center mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleRegister} className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700"
            required
          />
          <button type="submit" className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
            Register
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline cursor-pointer">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;