export interface Item {
  id: string;
  image?: string;
  name: string;
  type: string;
  schoolId: string;
  inStock: number;
  ordered: number;
  isTemporal: boolean;
}
