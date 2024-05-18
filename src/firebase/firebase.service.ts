import { Injectable } from '@nestjs/common';
import { getFirebaseInstance } from './firebase';

@Injectable()
export class FirebaseService {
  public getAuth() {
    return getFirebaseInstance().auth();
  }

  public getFirestore() {
    return getFirebaseInstance().firestore();
  }

  //to do: implement
  public login() {}

  //to do: implement
  public logout() {}
}
