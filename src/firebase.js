import firebase from 'firebase/app';
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}
  
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const db = getFirestore(app);

export const db = firebase.firestore();
export const getLeaderboard = async () => {
    return firebase.getDocs(firebase.collection(db, 'high-scores'))
};

export default app;
console.log(db);