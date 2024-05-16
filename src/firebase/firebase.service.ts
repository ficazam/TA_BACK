import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly database: FirebaseFirestore.Firestore;

  constructor() {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('../../teachers-aid-8ac41-firebase-adminsdk-tw202-397382217d.json');

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });

    this.database = firebaseAdmin.firestore();
  }

  getFirestoreInstance(): FirebaseFirestore.Firestore {
    return this.database;
  }
}
