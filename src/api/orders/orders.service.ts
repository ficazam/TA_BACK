import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { Order } from 'src/core/types/order.type';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SchoolsService } from '../schools/schools.service';
import { FirestoreDocument } from 'src/firebase/core/firestore-reference-types.type';

@Injectable()
export class OrdersService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly schoolService: SchoolsService,
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
}
