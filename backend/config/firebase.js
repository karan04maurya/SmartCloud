const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const dotenv = require('dotenv');
dotenv.config();

let bucket = null;

try {
    // Attempt to load the service account key
    // You must generate this from Firebase Console -> Project Settings -> Service Accounts
    const serviceAccount = require('./serviceAccountKey.json');
    
    const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'smart-cloud-dbfc6.appspot.com'
    });
    
    bucket = getStorage(app).bucket();
    console.log('Firebase Admin initialized successfully.');
} catch (error) {
    console.warn('⚠️ Firebase Admin SDK initialization failed.');
    console.warn('⚠️ Please add serviceAccountKey.json to the backend/config directory.');
    console.warn('⚠️ Error:', error.message);
}

module.exports = { bucket };
