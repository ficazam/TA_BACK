import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { UserStatus } from 'src/core/enums/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly schoolsService: SchoolsService,
  ) {}

  public async getAllSchoolUsers(schoolId: string) {
    const database = this.firebaseService.getFirestore();

    const users: User[] = [];
    const userReference: FirestoreQueryReference = database.collection(
      FirebaseCollections.Users,
    );

    const usersSnapshot: FirestoreCollectionSnapshot =
      await userReference.get();

    usersSnapshot.forEach((document) => {
      const user: User = document.data() as User;

      if (schoolId === user.schoolId) {
        users.push(user);
      }
    });

    if (!users.length) {
      throw new NotFoundException('Users not found.');
    }

    return { success: true, data: users };
  }

  public async getSingleUser(userId: string) {
    const userReference = this.firebaseService
      .getFirestore()
      .collection(FirebaseCollections.Users)
      .doc(userId);

    const userData: FirestoreDocument = await userReference.get();
    const user: User = userData.data() as User;

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { success: true, data: user };
  }

  private async createAuthUser(email: string, password: string) {
    try {
      const auth = this.firebaseService.getAuth();

      const userRef: UserRecord = await auth.createUser({ email, password });

      return userRef;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async createNewUser(newUser: createUserDto) {
    if (
      !newUser.email ||
      !newUser.password ||
      !newUser.name ||
      !newUser.surname ||
      !newUser.role ||
      !newUser.status ||
      (newUser.role !== UserRole.Admin &&
        newUser.role !== UserRole.Principal &&
        !newUser.schoolId)
    ) {
      throw new BadRequestException(
        'Incomplete user - please fill in all fields.',
      );
    }

    try {
      const userRef = await this.createAuthUser(
        newUser.email,
        newUser.password,
      );

      if (!userRef) {
        throw new InternalServerErrorException('Error creating user!');
      }

      const user: User = {
        id: userRef.uid,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        role: newUser.role,
        status: newUser.status,
        schoolId: newUser.schoolId,
        image: newUser.image,
        orders: [],
      };

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

      return { success: true, data: user };
    } catch (error) {
      throw new InternalServerErrorException(error.response.message);
    }
  }

  public async updateUser(userData: Partial<User>) {
    try {
      const existingUserData = await this.getSingleUser(userData.id!);
      const existingUser = existingUserData.data;

      const newUserData: User = { ...userData, ...existingUser } as User;

      await this.firebaseService
        .getFirestore()
        .collection(FirebaseCollections.Users)
        .doc(newUserData.id)
        .set(newUserData);

      return { success: true };
    } catch (error) {
      throw new BadRequestException(error.response.message);
    }
  }

  public async userLogin(userId) {
    try {
      const userData = await this.getSingleUser(userId);
      const user = userData.data;

      const { role, schoolId, status } = user;

      if (role !== UserRole.Admin) {
        const schoolExistsData =
          await this.schoolsService.doesSchoolExist(schoolId);
        const schoolExists = schoolExistsData.data;

        if (!schoolExists) {
          throw new NotFoundException('School not found!');
        }
      }

      switch (status) {
        case UserStatus.Active:
        case UserStatus.Unverified:
          return { success: true, data: user };
        case UserStatus.Inactive:
          throw new UnauthorizedException('This account is inactive.');
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error Signing In');
    }
  }

  public async userLogout(user: User) {
    try {
      await this.firebaseService.getAuth().revokeRefreshTokens(user.id);
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error logging user out.');
    }
  }
}
