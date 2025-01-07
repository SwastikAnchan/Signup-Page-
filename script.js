// Comprehensive Firebase Signup Script
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Signup Functionality
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const errorMessage = document.getElementById("error-message");

  // Comprehensive Validation Function
  function validateForm(formData) {
    const errors = [];

    // Validation Rules
    if (!formData.fullName || formData.fullName.length < 2) {
      errors.push("Full name must be at least 2 characters long");
    }

    if (!formData.username || formData.username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push("Invalid email format");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.push("Phone number must be 10 digits");
    }

    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  }

  // Signup Form Submission Handler
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect Form Data
    const formData = {
      fullName: document.getElementById("full-name").value.trim(),
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirm-password").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
    };

    // Validate Form
    const validationErrors = validateForm(formData);

    // Display Validation Errors
    if (validationErrors.length > 0) {
      errorMessage.innerHTML = validationErrors
        .map((error) => `<p>${error}</p>`)
        .join("");
      return;
    }

    try {
      // Firebase User Creation
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Prepare User Data for Firestore
      const userData = {
        uid: user.uid,
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Success Handling
      console.log("User registered successfully");
      errorMessage.innerHTML =
        '<p style="color: green;">Registration Successful!</p>';

      // Optional: Reset Form
      signupForm.reset();

      // Optional: Redirect
      // window.location.href = 'dashboard.html';
    } catch (error) {
      // Detailed Error Handling
      console.error("Registration Error:", error);

      let errorMsg = "Registration failed. ";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMsg += "Email is already registered.";
          break;
        case "auth/invalid-email":
          errorMsg += "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMsg += "Password is too weak.";
          break;
        default:
          errorMsg += error.message;
      }

      errorMessage.innerHTML = `<p style="color: red;">${errorMsg}</p>`;
    }
  });
});
