import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCezMB50yUhqPfaslER4y8s7JD63H6gEhk',
  authDomain: 'co-caro-257408.firebaseapp.com',
  databaseURL: 'https://co-caro-257408.firebaseio.com',
  projectId: 'co-caro-257408',
  storageBucket: 'co-caro-257408.appspot.com',
  messagingSenderId: '1047564563759',
  appId: '1:1047564563759:web:31d4a47286de903c7e1dda',
  measurementId: 'G-3DS4BMRMXD'
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
