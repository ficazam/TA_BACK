import { OrderStatus } from '../enums/order-status.enum';
import { Item } from './item.type';

export interface Order {
  id: string;
  creationDate: Date;
  deliveryDate: Date;
  status: OrderStatus;
  schoolId: string;
  teacherId: string;
  requiresApproval: boolean;
  items: Item[];
}

export const emptyOrder: Order = {
  id: '',
  creationDate: new Date(),
  deliveryDate: new Date(),
  status: OrderStatus.Ordered,
  requiresApproval: false,
  teacherId: '',
  items: [],
  schoolId: '',
};
