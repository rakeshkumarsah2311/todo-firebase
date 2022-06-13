import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyARkHyBgq0zhZXsxHbdf16jVKY6DN-Cz1Y",
    authDomain: "todo-firebase-2da9e.firebaseapp.com",
    databaseURL: "https://todo-firebase-2da9e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todo-firebase-2da9e",
    storageBucket: "todo-firebase-2da9e.appspot.com",
    messagingSenderId: "399218982962",
    appId: "1:399218982962:web:0017733c53e53224bcbc2b"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const auth = getAuth()
export { db, auth }