import { OrderStatus } from '../enums/order-status.enum';

export interface Order {
  id: string;
  creationDate: Date;
  deliveryDate: Date;
  status: OrderStatus;
  schoolId: string;
  teacherId: string;
  requiresApproval: boolean;
  items: { itemId: string; amount: number }[];
  approved?: boolean;
  approvedById?: boolean;
}
