import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyByG0F0-Qct5T1j6MMXjzyjnvnMKk7S3eU",
    authDomain: "blogging-platform-1b31b.firebaseapp.com",
    projectId: "blogging-platform-1b31b",
    storageBucket: "blogging-platform-1b31b.firebasestorage.app",
    messagingSenderId: "450272704416",
    appId: "1:450272704416:web:669ac62c5eb1f0cfba96c5",
    measurementId: "G-YNP9PK92FW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Initialize analytics (won’t work in localhost without HTTPS)
const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup, signOut };
