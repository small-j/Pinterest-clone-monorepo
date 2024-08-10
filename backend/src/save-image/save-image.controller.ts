import {
  Controller,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { CreateSaveImageDto } from './dto/create-save-image.dto';
import { RolesGuard } from 'src/guard/roles-guard';

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
  @UseGuards(RolesGuard)
  async deleteSaveImage(@Query('id') id: number): Promise<number> {
    return await this.saveImageService.deleteSaveImage(id);
  }
}
