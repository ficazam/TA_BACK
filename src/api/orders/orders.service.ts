import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { Order } from 'src/core/types/order.type';
import { SchoolsService } from '../schools/schools.service';
import {
  FirestoreDocument,
  FirestoreDocumentReference,
} from 'src/firebase/core/firestore-reference-types.type';
import { createOrderDto } from './DTO/create-order.dto';
import { v4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private readonly schoolService: SchoolsService) {}

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

      return { success: true, data: allOrders };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async getAllTeacherOrders(schoolId: string, teacherId: string) {
    console.log('called?');

    try {
      const ordersData = await this.getAllOrders(schoolId);
      const allOrders: Order[] = ordersData.data;

      allOrders.filter((order) => order.teacherId === teacherId);

      return { success: true, data: allOrders };
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

      return { success: true, data: orderData.data() };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async createNewOrder(newOrder: createOrderDto) {
    try {
      const order: Order = {
        ...newOrder,
        creationDate: new Date(),
        deliveryDate: new Date(),
        id: v4(),
      };

      const schoolReference = await this.schoolService.singleSchoolReference(
        order.schoolId,
      );

      const orderReference: FirestoreDocumentReference = schoolReference
        .collection(FirebaseCollections.Orders)
        .doc(order.id);

      await orderReference.set(order);

      return { success: true };
    } catch (error) {
      throw new NotFoundException(error, 'Not Found');
    }
  }

  public async updateOrder(orderInfo: Partial<Order>) {
    try {
      const schoolReference = await this.schoolService.singleSchoolReference(
        orderInfo.schoolId,
      );

      const orderReference: FirestoreDocumentReference = schoolReference
        .collection(FirebaseCollections.Orders)
        .doc(orderInfo.id);

      await orderReference.set(orderInfo);

      //TODO: ADD ERROR VALIDATIONS - EX IF FIELDS ARE EMPTY
      return { success: true };
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error, 'Not found');
    }
  }
}
