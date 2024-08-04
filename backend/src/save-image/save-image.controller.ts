import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { CreateSaveImageDto } from './dto/create-save-image.dto';

@Controller('save-image')
export class SaveImageController {
  constructor(private readonly saveImageService: SaveImageService) {}

  @Post()
  create(@Body() createSaveImageDto: CreateSaveImageDto) {
    return this.saveImageService.create(createSaveImageDto);
  }

  @Get()
  findAll() {
    return this.saveImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saveImageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saveImageService.remove(+id);
  }
}
