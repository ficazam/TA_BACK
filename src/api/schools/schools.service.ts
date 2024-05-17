import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { ISchoolInfo } from 'src/core/types/school.type';
import {
  FirestoreCollectionSnapshot,
  FirestoreDocumentReference,
} from 'src/firebase/core/firestore-reference-types.type';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async getAllSchools() {
    try {
      const schools: ISchoolInfo[] = [];
      const schoolData: FirestoreCollectionSnapshot = await this.firebaseService
        .collection(FirebaseCollections.Schools)
        .get();

      schoolData.forEach((document) =>
        schools.push(document.data() as ISchoolInfo),
      );

      return { success: true, data: schools };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async singleSchoolReference(schoolId: string) {
    const schoolReference: FirestoreDocumentReference = this.firebaseService
      .collection(FirebaseCollections.Schools)
      .doc(schoolId);

    return schoolReference;
  }

  public async getSingleSchool(schoolId: string) {
    try {
      const schoolDataReference: FirestoreDocumentReference =
        await this.singleSchoolReference(schoolId);

      const schoolData = await schoolDataReference.get();

      return { success: true, data: schoolData.data() };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }
}