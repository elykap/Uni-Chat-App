import React, { useState, useEffect, useRef } from "react";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, orderBy, query, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth(); // Get logged-in user
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "messages"), orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setMessages(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data().user || "Unknown",
            text: doc.data().text || "",
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }))
        );
      });
      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    if (!user) return;

    await addDoc(collection(db, "messages"), {
      user: user.email, // Store email as the user identifier
      text,
      createdAt: new Date(),
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map(({ id, user: senderEmail, text, createdAt }) => {
          const isCurrentUser = senderEmail === user.email; // Check if message is from logged-in user
          
          return (
            <div key={id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <p>{text}</p>
                <p className="text-xs text-gray-400 dark:text-gray-300 mt-1 text-right">
                  {format(createdAt, "MM/dd/yyyy hh:mm a")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 flex w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none dark:bg-gray-700"
        />
        <button
          onClick={handleSend}
          className="px-6 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;