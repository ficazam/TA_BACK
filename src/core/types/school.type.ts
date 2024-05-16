import { SchoolStatus } from '../enums/school-status.enum';

export interface ISchoolInfo {
  id: string;
  name: string;
  image?: string;
  status: SchoolStatus;
  principalId: string;
  employees: string[];
}

export const emptySchool: ISchoolInfo = {
  id: '',
  name: '',
  status: SchoolStatus.Active,
  principalId: '',
  employees: [],
};
