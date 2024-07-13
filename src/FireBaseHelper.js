// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA0EgIx2qDNsaXXhIoVVSAts3FKzx6dMQU",
    authDomain: "gpt4-d0eb3.firebaseapp.com",
    databaseURL: "https://gpt4-d0eb3-default-rtdb.firebaseio.com",
    projectId: "gpt4-d0eb3",
    storageBucket: "gpt4-d0eb3.appspot.com",
    messagingSenderId: "651210514662",
    appId: "1:651210514662:web:7abf5fcb6bfa7b9ea21b27",
    measurementId: "G-PVRR02YW6B",
  };
  return initializeApp(firebaseConfig);
};
