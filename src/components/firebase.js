
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrMdNlOEMe6KnlhdmWBui5eH0KYyF_O9c",
  authDomain: "monblog-e237f.firebaseapp.com",
  projectId: "monblog-e237f",
  storageBucket: "monblog-e237f.appspot.com",
  messagingSenderId: "124183885770",
  appId: "1:124183885770:web:93598eae9b2e65d4e88133",
  databaseURL: "https://monblog-e237f-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;