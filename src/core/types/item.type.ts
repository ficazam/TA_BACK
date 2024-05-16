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

export const emptyItem: Item = {
  id: '',
  image: '',
  name: '',
  type: '',
  inStock: 0,
  ordered: 0,
  isTemporal: false,
  schoolId: '',
};
