import * as firebaseAdmin from 'firebase-admin';

let initializedApp: firebaseAdmin.app.App;

export const getFirebaseInstance = (): firebaseAdmin.app.App => {
  if (initializedApp) {
    return initializedApp;
  }

  initializedApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.STORAGE_BUCKET,
  });

  initializedApp.firestore().settings({
    ignoreUndefinedProperties: true,
  });

  return initializedApp;
};
