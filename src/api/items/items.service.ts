import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SchoolsService } from '../schools/schools.service';
import { Item } from 'src/core/types/item.type';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import { FirestoreDocument } from 'src/firebase/core/firestore-reference-types.type';
import { createItemDto } from './DTO/create-item.dto';
import { v4 } from 'uuid';

@Injectable()
export class ItemsService {
  constructor(private readonly schoolService: SchoolsService) {}

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

  public async createNewItem(newItem: createItemDto) {
    try {
      const item: Item = { ...newItem, id: v4() };
      const schoolReference = await this.schoolService.singleSchoolReference(
        item.schoolId,
      );

      const itemReference = schoolReference
        .collection(FirebaseCollections.Items)
        .doc(item.id);

      await itemReference.set(item);

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async updateItem(itemInfo: Item) {
    try {
      const schoolReference = await this.schoolService.singleSchoolReference(
        itemInfo.schoolId,
      );
      const itemReference = schoolReference
        .collection(FirebaseCollections.Items)
        .doc(itemInfo.id);

      await itemReference.set(itemInfo);

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
