import { createOrderDto } from 'src/api/orders/DTO/create-order.dto';

export const orderValidations = (order: createOrderDto) => {
  if (
    !order.deliveryDate ||
    !order.schoolId ||
    !order.teacherId ||
    order.requiresApproval === undefined ||
    order.items === undefined
  ) {
    return false;
  }
  return true;
};
