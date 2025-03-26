import { db } from "./firebaseConfig"; // Make sure db is imported from firebaseConfig
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// Define the reference to the 'messages' collection
const messagesRef = collection(db, "messages");

// Send a message to Firestore
export const sendMessage = async (text, user) => {
    try {
        if (!text.trim()) {
            console.error("Message text is empty");
            return; // Don't send empty messages
        }

        await addDoc(messagesRef, {
            text: text.trim(),
            user,
            createdAt: serverTimestamp(), // Automatically sets server timestamp
        });

        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

// Subscribe to messages in real-time
export const subscribeToMessages = (callback) => {
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages); // Pass updated messages to the callback
    }, (error) => {
        console.error("Error fetching messages:", error);
    });

    // Return unsubscribe function to allow cleaning up the listener
    return unsubscribe;
};
