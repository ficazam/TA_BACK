import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { ISchoolInfo } from 'src/core/types/school.type';
import {
  FirestoreCollectionSnapshot,
  FirestoreDocumentReference,
} from 'src/firebase/core/firestore-reference-types.type';
import { createSchoolDto } from './DTO/create-school.dto';
import { createUserDto } from '../users/DTO';
import { v4 } from 'uuid';
import { User } from 'src/core/types/user.type';
import { SchoolStatus } from 'src/core/enums/school-status.enum';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserRole } from 'src/core/enums/user-role.enum';
import { UserStatus } from 'src/core/enums/user-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class SchoolsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  public async getAllSchools() {
    try {
      const schools: ISchoolInfo[] = [];
      const schoolData: FirestoreCollectionSnapshot = await this.firebaseService
        .getFirestore()
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
      .getFirestore()
      .collection(FirebaseCollections.Schools)
      .doc(schoolId);

    return schoolReference;
  }

  public async getSingleSchool(schoolId: string) {
    try {
      const schoolDataReference: FirestoreDocumentReference =
        await this.singleSchoolReference(schoolId);

      const schoolData = await schoolDataReference.get();
      const school = schoolData.data();

      if (!school) {
        throw new NotFoundException('School data not found.');
      }

      return { success: true, data: school };
    } catch (error) {
      throw new NotFoundException(error.response.message);
    }
  }

  public async createNewSchool(
    newUser: createUserDto,
    newSchool: createSchoolDto,
  ) {
    if (!newSchool.name) {
      throw new BadRequestException(
        'Incomplete school - please fill in all fields.',
      );
    }

    const doesSchoolExistData = await this.doesSchoolExist(newSchool.name);
    const doesSchoolExist = doesSchoolExistData.data;

    if (doesSchoolExist) {
      throw new BadRequestException('School already exists');
    }

    try {
      const schoolId: string = v4();

      const userData: createUserDto = {
        ...newUser,
        role: UserRole.Principal,
        status: UserStatus.Inactive,
      };

      const userRef = await this.userService.createNewUser(userData);
      const user: User = userRef.data;

      const school: ISchoolInfo = {
        ...newSchool,
        id: schoolId,
        principalId: user.id,
        employees: [],
        status: SchoolStatus.Active,
      };

      school.employees.push(user.id);

      await this.firebaseService
        .getFirestore()
        .collection(FirebaseCollections.Schools)
        .doc(school.id)
        .set(school);

      await this.userService.updateUser({ id: user.id, schoolId: school.id });

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async updateSchool(schoolInfo: ISchoolInfo) {
    try {
      await this.firebaseService
        .getFirestore()
        .collection(FirebaseCollections.Schools)
        .doc(schoolInfo.id)
        .set(schoolInfo);

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async doesSchoolExist(schoolName: string) {
    try {
      const schoolsDataReference = await this.getAllSchools();
      const schoolsData = schoolsDataReference.data;

      const findSchool = schoolsData.find(
        (school) => school.name === schoolName || school.id === schoolName,
      );

      return { success: true, data: Boolean(findSchool) };
    } catch (error) {
      throw new BadRequestException(error.response.message);
    }
  }
}
