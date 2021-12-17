import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

//
//I was going to put sensitive data into .env file, and then import it, but I kept it like this so I could deploy app live to github pages for demo
//

const firebaseConfig = {
  apiKey: "AIzaSyBw1aGvDfJ5wHJymCCucERmCNhICNE0y_Q",
  authDomain: "timetrack-tool.firebaseapp.com",
  projectId: "timetrack-tool",
  storageBucket: "timetrack-tool.appspot.com",
  messagingSenderId: "821897615882",
  appId: "1:821897615882:web:006da1859cf083422f5df3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
