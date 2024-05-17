import { OrderByDirection } from 'firebase/firestore';

export interface IRequestConfig {
  collection: string;
  injectFirebaseIdIntoReturnedData?: boolean;
  paginateAndFilterQuery?: {
    search: string;
    orderBy: string;
    orderByDirection: OrderByDirection;
    infiniteScrollRefId: string;
    limitResults: number;
  };
}
