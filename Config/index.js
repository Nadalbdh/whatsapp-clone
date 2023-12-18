// Import the functions you need from the SDKs you need
import app  from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXVdJPPUETYLwXcnuFViC4lCWSIIpnz3E",
  authDomain: "tpmobile3-37440.firebaseapp.com",
  databaseURL: "https://tpmobile3-37440-default-rtdb.firebaseio.com",
  projectId: "tpmobile3-37440",
  storageBucket: "tpmobile3-37440.appspot.com",
  messagingSenderId: "105376696938",
  appId: "1:105376696938:web:759be4d747bd594dabd813"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;