// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"


// firebase hosting:clone SOURCE_SITE_ID:test-01-dd84c TARGET_SITE_ID:live

const firebaseConfig = {
    apiKey: "AIzaSyAAZf1InnAN_S3EtHrtZ-LlEI69r0LX-QE",
    authDomain: "test-01-dd84c.firebaseapp.com",
    projectId: "test-01-dd84c",
    storageBucket: "test-01-dd84c.appspot.com",
    messagingSenderId: "1093955420226",
    appId: "1:1093955420226:web:b2dd74f45ebce7fe476ddb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db =  getFirestore(app);