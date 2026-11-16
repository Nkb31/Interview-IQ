
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-agent-f9ff4.firebaseapp.com",
  projectId: "ai-interview-agent-f9ff4",
  storageBucket: "ai-interview-agent-f9ff4.firebasestorage.app",
  messagingSenderId: "155162403333",
  appId: "1:155162403333:web:4fd786916addce3e2cf26c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}