import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD_1o3OEOsHXowRE9UlZ_-o9Ftfv6xxm1w",
    authDomain: "cms-noticias-infosphere.firebaseapp.com",
    projectId: "cms-noticias-infosphere",
    storageBucket: "cms-noticias-infosphere.appspot.com",
    messagingSenderId: "222461128007",
    appId: "1:222461128007:web:3377965a9cc3749c493062",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
