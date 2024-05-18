import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { loginDto } from './DTO/login.dto';

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
        .getFirestore()
        .collection(FirebaseCollections.Users)
        .doc(userId);

      const userData: FirestoreDocument = await userReference.get();

      return { success: true, data: userData.data() };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  private async createAuthUser(email: string, password: string) {
    try {
      const auth = await this.firebaseService.getAuth();

      const userRef = await auth.createUser({ email, password });

      return userRef;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  public async createNewUser(newUser: createUserDto) {
    try {
      const userRef = await this.createAuthUser(
        newUser.email,
        newUser.password,
      );

      const user: User = { ...newUser, id: userRef.uid };

      await this.firebaseService
        .getFirestore()
        .collection(FirebaseCollections.Users)
        .doc(user.id)
        .set(user);

      if (user.schoolId) {
        const schoolData = await this.schoolsService.getSingleSchool(
          newUser.schoolId,
        );

        const school = schoolData.data as ISchoolInfo;

        const schoolUpdate: ISchoolInfo = {
          ...school,
          employees: [...school.employees, user.id],
        };

        await this.firebaseService
          .getFirestore()
          .collection(FirebaseCollections.Schools)
          .doc(schoolUpdate.id)
          .set(schoolUpdate);
      }

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  //to do: implement
  public async userLogin(loginBody: loginDto) {
    try {
      const { email, password } = loginBody;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error Signing In');
    }
  }

  //to do: implement
  public async userLogout() {
    try {
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error logging user out.');
    }
  }
}
