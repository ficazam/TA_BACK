import * as firebaseAdmin from 'firebase-admin';

export type FirestoreCollectionReference =
  FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

export interface IGetFirebaseDocParams {
  collection: string;
  documentId: string;
  getData?: boolean; // If we set this to false, we can only do operations with the document (like delete)
  injectFirebaseIdIntoReturnedData?: boolean; // If we set this to true, we can get the firebase id of the documents
}

export type FirestoreQueryReference =
  FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

export type FirestoreCollectionSnapshot =
  firebaseAdmin.firestore.QuerySnapshot<firebaseAdmin.firestore.DocumentData>;

export type FirestoreDocumentReference = FirebaseFirestore.DocumentReference<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

export type FirestoreDocument = FirebaseFirestore.DocumentSnapshot<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;
