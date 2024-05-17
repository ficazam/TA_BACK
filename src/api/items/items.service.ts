import { Injectable, NotFoundException } from '@nestjs/common';
import { SchoolsService } from '../schools/schools.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Item } from 'src/core/types/item.type';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { FirestoreDocument } from 'src/firebase/core/firestore-reference-types.type';

@Injectable()
export class ItemsService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly schoolService: SchoolsService,
  ) {}

  public async getAllItems(schoolId: string) {
    try {
      const allItems: Item[] = [];

      const schoolReference =
        await this.schoolService.singleSchoolReference(schoolId);

      const itemsData = await schoolReference
        .collection(FirebaseCollections.Items)
        .get();

      itemsData.forEach((document) => allItems.push(document.data() as Item));

      return { success: true, data: allItems };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }

  public async getSingleItem(schoolId: string, itemId: string) {
    try {
      const schoolReference =
        await this.schoolService.singleSchoolReference(schoolId);

      const item: FirestoreDocument = await schoolReference
        .collection(FirebaseCollections.Items)
        .doc(itemId)
        .get();

      return { success: true, data: item.data() };
    } catch (error) {
      throw new NotFoundException(error, 'Not found');
    }
  }
}
