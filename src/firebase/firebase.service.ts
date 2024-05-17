import { Injectable, NotFoundException } from '@nestjs/common';
import { getFirebaseInstance } from './firebase';
import {
  FirestoreCollectionReference,
  IGetFirebaseDocParams,
} from './core/firestore-reference-types.type';

@Injectable()
export class FirebaseService {
  public getAuth() {
    return getFirebaseInstance().auth();
  }

  public getFirestore() {
    return getFirebaseInstance().firestore();
  }

  /**
   *
   * @param getDocumentparams
   */
  public async getDoc<T>(getDocumentparams: IGetFirebaseDocParams): Promise<T> {
    // Verify if getDocumentparams has getData property and if not set to true, default value
    if (!getDocumentparams.hasOwnProperty('getData')) {
      getDocumentparams.getData = true;
    }
    try {
      const documentSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> =
        await getFirebaseInstance()
          .firestore()
          .collection(getDocumentparams.collection)
          .doc(getDocumentparams.documentId)
          .get();

      const objectData = documentSnapshot.data();

      if (getDocumentparams.getData) {
        if (getDocumentparams.injectFirebaseIdIntoReturnedData) {
          objectData.id = documentSnapshot.id;
        }

        return objectData as T;
      }

      return documentSnapshot as T;
    } catch (exception) {
      console.error('Could not get document', exception);
      throw new NotFoundException(exception, 'Not Found');
    }
  }

  public async setDoc(
    collection: string,
    documentData = {},
    documentId: string = null,
  ): Promise<FirebaseFirestore.WriteResult> {
    try {
      if (documentId) {
        return getFirebaseInstance()
          .firestore()
          .collection(collection)
          .doc(documentId)
          .set(documentData);
      }

      return getFirebaseInstance()
        .firestore()
        .collection(collection)
        .doc()
        .set(documentData);
    } catch (exception) {
      console.error('Could not set document', exception);
      throw new NotFoundException(exception, 'Not Found');
    }
  }

  public async updateDoc(
    collection: string,
    documentId: string = null,
    documentData = {},
  ): Promise<FirebaseFirestore.WriteResult> {
    try {
      return getFirebaseInstance()
        .firestore()
        .collection(collection)
        .doc(documentId)
        .update(documentData);
    } catch (exception) {
      throw new NotFoundException(exception, 'Not Found');
    }
  }

  public async removeDoc(
    collection: string,
    documentId: string,
  ): Promise<FirebaseFirestore.WriteResult> {
    try {
      return getFirebaseInstance()
        .firestore()
        .collection(collection)
        .doc(documentId)
        .delete();
    } catch (exception) {
      throw new NotFoundException(exception, 'Not Found');
    }
  }

  public collection(collectionName: string): FirestoreCollectionReference {
    return getFirebaseInstance().firestore().collection(collectionName);
  }
}
