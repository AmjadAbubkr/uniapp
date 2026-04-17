import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBxRYz2ZjJJfr_Elvp2Dj_fJUeQ7_X2V7E',
  authDomain: 'uni-app-f2795.firebaseapp.com',
  projectId: 'uni-app-f2795',
  storageBucket: 'uni-app-f2795.firebasestorage.app',
  messagingSenderId: '518230288187',
  appId: '1:518230288187:web:4e24cb041e2ecb1c9a791e',
};

export const authInstance = auth();
export const db = firestore();
export const functionsInstance = functions();
export const messagingInstance = messaging();

export default firebase;
