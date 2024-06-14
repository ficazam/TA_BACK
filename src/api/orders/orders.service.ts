import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { Order } from 'src/core/types/order.type';
import { SchoolsService } from '../schools/schools.service';
import {
  FirestoreDocument,
  FirestoreDocumentReference,
} from 'src/firebase/core/firestore-reference-types.type';
import { createOrderDto } from './DTO/create-order.dto';
import { v4 } from 'uuid';
import { ItemsService } from '../items/items.service';
import { Item } from 'src/core/types/item.type';
import { OrderStatus } from 'src/core/enums/order-status.enum';
import { orderValidations } from 'src/core/utils/order-validations.util';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/core/enums/user-role.enum';
import { NotificationService } from './notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly schoolService: SchoolsService,
    private readonly itemService: ItemsService,
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationService,
  ) {}

  public async getAllOrders(schoolId: string) {
    try {
      const allOrders: Order[] = [];

      const schoolReference =
        await this.schoolService.singleSchoolReference(schoolId);

      const ordersData = await schoolReference
        .collection(FirebaseCollections.Orders)
        .get();

      ordersData.forEach((document) => {
        const orderItemData = document.data();

        const modifiedOrderItem: Order = {
          ...orderItemData,
          creationDate: orderItemData.creationDate.toDate(),
          deliveryDate: orderItemData.deliveryDate.toDate(),
        } as Order;

        allOrders.push(modifiedOrderItem);
      });

      const sortedOrders = allOrders.sort(
        (a, b) => b.creationDate.getTime() - a.creationDate.getTime(),
      );

      return { success: true, data: sortedOrders };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async getAllTeacherOrders(schoolId: string, teacherId: string) {
    try {
      const ordersData = await this.getAllOrders(schoolId);
      const allOrders: Order[] = ordersData.data;

      const filteredOrders = allOrders.filter(
        (order) => order.teacherId === teacherId,
      );

      return { success: true, data: filteredOrders };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async getSingleOrder(schoolId: string, orderId: string) {
    try {
      const schoolReference =
        await this.schoolService.singleSchoolReference(schoolId);

      const orderData: FirestoreDocument = await schoolReference
        .collection(FirebaseCollections.Orders)
        .doc(orderId)
        .get();

      const order = orderData.data();
      const modifiedOrder: Order = {
        ...order,
        creationDate: order.creationDate.toDate(),
        deliveryDate: order.deliveryDate.toDate(),
      } as Order;

      return { success: true, data: modifiedOrder };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async createNewOrder(newOrder: createOrderDto) {
    if (!orderValidations(newOrder)) {
      throw new BadRequestException(
        'Incomplete order - please fill in all fields.',
      );
    }

    try {
      const order: Order = {
        ...newOrder,
        status: OrderStatus.Ordered,
        creationDate: new Date(),
        deliveryDate: new Date(newOrder.deliveryDate),
        id: v4(),
      };

      const schoolReference = await this.schoolService.singleSchoolReference(
        order.schoolId,
      );

      for (const item of order.items) {
        if (!item.itemId) {
          throw new NotFoundException('Item not found!');
        }

        const itemData = await this.itemService.getSingleItem(
          order.schoolId,
          item.itemId,
        );

        const dbItem: Item = itemData.data as Item;
        const newItem: Item = {
          ...dbItem,
          ordered: dbItem.ordered + item.amount,
        };

        await this.itemService.updateItem(newItem);
      }

      const orderReference: FirestoreDocumentReference = schoolReference
        .collection(FirebaseCollections.Orders)
        .doc(order.id);

      await orderReference.set(order);

      const userData = await this.userService.getSingleUser(order.teacherId);
      const user = userData.data;
      const newUserOrders = { ...user, orders: [...user.orders, order.id] };

      await this.userService.updateUser(newUserOrders);

      //notifications:
      const schoolUsersData = await this.userService.getAllSchoolUsers(
        order.schoolId,
      );

      const schoolUsers = schoolUsersData.data;

      const notificactionUsers = schoolUsers
        .filter((user) =>
          order.requiresApproval
            ? user.role === UserRole.Coordinator
            : user.role === UserRole.Inventory,
        )
        .map((user) => user.notificationToken);

      await this.notificationsService.sendNewOrderNotifications(
        notificactionUsers,
      );

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async updateOrder(orderInfo: Partial<Order>) {
    if (!orderInfo.id) {
      throw new NotFoundException('Order not found!');
    }

    if (!orderInfo.schoolId) {
      throw new NotFoundException('School not found!');
    }

    try {
      const schoolReference = await this.schoolService.singleSchoolReference(
        orderInfo.schoolId,
      );

      const orderReference: FirestoreDocumentReference = schoolReference
        .collection(FirebaseCollections.Orders)
        .doc(orderInfo.id);

      const oldOrderData = await orderReference.get();
      const oldOrder = oldOrderData.data();

      const newOrderInfo = {
        ...oldOrder,
        ...orderInfo,
        creationDate: new Date(orderInfo.creationDate),
        deliveryDate: new Date(orderInfo.deliveryDate),
      };

      await orderReference.set(newOrderInfo);

      //notification:
      const teacherData = await this.userService.getSingleUser(
        newOrderInfo.teacherId,
      );

      const teacherToken = teacherData.data.notificationToken;

      await this.notificationsService.sendOrderUpdatedNotifications(
        teacherToken,
      );

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
