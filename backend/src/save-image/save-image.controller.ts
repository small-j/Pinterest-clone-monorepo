import { Controller, Post, Delete, Body, Query } from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { CreateSaveImageDto } from './dto/create-save-image.dto';

@Controller('save-image')
export class SaveImageController {
  constructor(private readonly saveImageService: SaveImageService) {}

  @Post()
  async addSaveImage(
    @Body() saveImageRequest: CreateSaveImageDto,
  ): Promise<number> {
    return await this.saveImageService.addSaveImage(saveImageRequest);
  }

  @Delete()
  async deleteSaveImage(@Query('id') id: number): Promise<number> {
    return await this.saveImageService.deleteSaveImage(id);
  }
}
