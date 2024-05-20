import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { createItemDto } from './DTO/create-item.dto';
import { Item } from 'src/core/types/item.type';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get(':schoolId')
  public async getAllItems(@Param('schoolId') schoolId: string) {
    return this.itemsService.getAllItems(schoolId);
  }

  @Get(':schoolId/item/:itemId')
  public async getSingleItem(
    @Param('schoolId') schoolId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.itemsService.getSingleItem(schoolId, itemId);
  }

  @Post()
  public async createNewItem(@Body() newItem: createItemDto) {
    return this.itemsService.createNewItem(newItem);
  }

  @Patch()
  public async updateItem(@Body() itemInfo: Item) {
    return this.itemsService.updateItem(itemInfo);
  }
}
