import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAguBHfbR9-slOwSpjHu7D2-Wjss7cUlZE',
    appId: '1:557833498009:web:015d8487c00b51ff7d7708',
    messagingSenderId: '557833498009',
    projectId: 'lingolume',
    authDomain: 'lingolume.firebaseapp.com',
    storageBucket: 'lingolume.firebasestorage.app',
    measurementId: 'G-RGN12ZP4CQ',
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
