// Use this exact import method
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase Configuration
var firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://DATABASE_NAME.firebaseio.com",
  projectId: "PROJECT_ID",
  // The value of `storageBucket` depends on when you provisioned your default bucket (learn more)
  storageBucket: "PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services
export { app, db, auth };
// Firestore reference
// const db = firebase.firestore();

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

// Send message to Firestore
sendButton.addEventListener("click", async () => {
  const message = messageInput.value;
  if (message.trim()) {
    try {
      await db.collection("messages").add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      messageInput.value = "";
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to send message. Please try again.");
    }
  } else {
    alert("Message cannot be empty!");
  }
});

// Listen for new messages
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((querySnapshot) => {
    chatMessages.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageElement = document.createElement("div");
      const timestamp = messageData.timestamp
        ? messageData.timestamp.toDate().toLocaleString()
        : "Just now";

      messageElement.innerHTML = `
              <p><strong>${messageData.text}</strong></p>
              <small>${timestamp}</small>
          `;
      chatMessages.appendChild(messageElement);
    });
  });
