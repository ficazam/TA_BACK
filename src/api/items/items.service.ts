import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SchoolsService } from '../schools/schools.service';
import { Item } from 'src/core/types/item.type';
import { FirebaseCollections } from 'src/core/enums/firebase-collections.enum';
import {
  FirestoreDocument,
  FirestoreDocumentReference,
} from 'src/firebase/core/firestore-reference-types.type';
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
    if (
      !newItem.name ||
      !newItem.type ||
      !newItem.schoolId ||
      !newItem.inStock ||
      newItem.ordered === undefined ||
      newItem.isTemporal === undefined
    ) {
      throw new BadRequestException(
        'Incomplete item data, please fill in all fields.',
      );
    }

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
    if (!itemInfo.id) {
      throw new BadRequestException('No item to find');
    }

    if (!itemInfo.schoolId) {
      throw new BadRequestException('No school to find');
    }

    const doesSchoolExistData = await this.schoolService.doesSchoolExist(
      itemInfo.schoolId,
    );
    const doesSchoolExist = doesSchoolExistData.data;

    if (!doesSchoolExist) {
      throw new NotFoundException('School not found!');
    }

    try {
      const schoolReference: FirestoreDocumentReference =
        await this.schoolService.singleSchoolReference(itemInfo.schoolId);

      const itemReference: FirestoreDocumentReference = schoolReference
        .collection(FirebaseCollections.Items)
        .doc(itemInfo.id);

      const oldItemData = await itemReference.get();
      const oldItem = oldItemData.data();

      const newItemInfo = { ...oldItem, ...itemInfo };

      await itemReference.set(newItemInfo);
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
