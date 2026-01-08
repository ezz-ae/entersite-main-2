import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAUfgRu9b1oGt_4G0BmDSSvh8F_l3HkdDE",
  authDomain: "studio-400579658-555a8.firebaseapp.com",
  projectId: "studio-400579658-555a8",
  storageBucket: "studio-400579658-555a8.appspot.com",
  messagingSenderId: "1041936976898",
  appId: "1:1041936976898:web:221ec0c2844dbcd5576b1b",
  measurementId: "G-69V86H7B1N"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app as firebaseApp, auth as firebaseAuth };
