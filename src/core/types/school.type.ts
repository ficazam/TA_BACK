import { SchoolStatus } from '../enums/school-status.enum';

export interface ISchoolInfo {
  id: string;
  name: string;
  image?: string;
  status: SchoolStatus;
  principalId: string;
  employees: string[];
}
