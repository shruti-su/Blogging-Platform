import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAONoeRRAfqqIRaRUAXqPyiwCChK7ftHLw",
    authDomain: "excel-analytics-156e2.firebaseapp.com",
    projectId: "excel-analytics-156e2",
    storageBucket: "excel-analytics-156e2.appspot.com",
    messagingSenderId: "122842198740",
    appId: "1:122842198740:web:6b909ff146f87fd48e0141",
    measurementId: "G-HKB3RL6LS1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Optional: Initialize analytics (won’t work in localhost without HTTPS)
const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup, signOut };
