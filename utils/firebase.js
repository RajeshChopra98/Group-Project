import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from "../firebaseCredentials/trynocode-api-firebase-adminsdk-frbp3-6dc9c1436a.js";

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'trynocode-api.appspot.com'
});

const bucket = getStorage().bucket();

export { bucket };
