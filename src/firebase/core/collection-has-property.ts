import { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getFirebaseInstance } from '../firebase';

/**
 * This function will check if an object from a collection (the first)
 * has a given property, this will help to prevent returning empty arrays
 * from incorrect orderBy properties
 * All objects of the collection should have the same data structure, that is how our API
 * is designed
 * @param collection: Firebase collection
 * @param objectProperty: The name of the key we are looking for
 * @return Promise<boolean>
 */
export const collectionObjectsHasProp = async (
  collection: string,
  objectProperty: string,
): Promise<boolean> => {
  const collectionReference: QuerySnapshot<DocumentData> =
    (await getFirebaseInstance()
      .firestore()
      .collection(collection)
      .offset(0)
      .limit(1)
      .get()) as any;

  const documentElement = collectionReference.docs.map((doc) => doc.data());

  return (
    documentElement[0] && documentElement[0].hasOwnProperty(objectProperty)
  );
};
