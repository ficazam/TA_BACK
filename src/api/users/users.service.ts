import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { UserRole } from 'src/core/enums/user-role.enum';
import { User } from 'src/core/types/user.type';
import {
  FirestoreCollectionSnapshot,
  FirestoreDocument,
  FirestoreQueryReference,
} from 'src/firebase/core/firestore-reference-types.type';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';
import { ISchoolInfo } from 'src/core/types/school.type';
import { createUserDto } from './DTO';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly schoolsService: SchoolsService,
  ) {}

  public async getAllSchoolUsers(schoolId: string, userRole: UserRole) {
    const database = this.firebaseService.getFirestore();

    try {
      const users: User[] = [];
      const userReference: FirestoreQueryReference = database.collection(
        FirebaseCollections.Users,
      );
      const usersSnapshot: FirestoreCollectionSnapshot =
        await userReference.get();

      usersSnapshot.forEach((document) => {
        const user: User = document.data() as User;

        if (schoolId === user.schoolId && userRole === user.role) {
          users.push(user);
        }
      });

      return { success: true, data: users };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async getSingleUser(userId: string) {
    try {
      const userReference = this.firebaseService
        .collection(FirebaseCollections.Users)
        .doc(userId);

      const userData: FirestoreDocument = await userReference.get();

      return { success: true, data: userData.data() };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async createNewUser(newUser: createUserDto) {
    try {
      const user: User = { ...newUser, id: v4() };
      const schoolData = await this.schoolsService.getSingleSchool(
        newUser.schoolId,
      );

      const school = schoolData.data as ISchoolInfo;

      const schoolUpdate: ISchoolInfo = {
        ...school,
        employees: [...school.employees, user.id],
      };

      await this.firebaseService.setDoc(
        FirebaseCollections.Schools,
        schoolUpdate,
        schoolUpdate.id,
      );

      await this.firebaseService.setDoc(
        FirebaseCollections.Users,
        user,
        user.id,
      );

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }
}
