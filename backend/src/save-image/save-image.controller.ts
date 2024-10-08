import {
  Controller,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import { SaveImageService } from './save-image.service';
import { CreateSaveImageDto } from './dto/create-save-image.dto';
import { RolesGuard } from 'src/guard/roles-guard';
import { GetSaveImageDto } from './dto/get-save-image.dto';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetSaveImageIdDto } from './dto/get-save-image-id.dto';

@Controller('save-image')
export class SaveImageController {
  constructor(private readonly saveImageService: SaveImageService) {}

  @Post()
  async addSaveImage(
    @AuthUser() user: User,
    @Body() saveImageRequest: CreateSaveImageDto,
  ): Promise<GetSaveImageDto> {
    return await this.saveImageService.addSaveImage(saveImageRequest, user);
  }

  @Delete()
  @UseGuards(RolesGuard)
  async deleteSaveImage(@Query('id') id: number): Promise<GetSaveImageIdDto> {
    return await this.saveImageService.deleteSaveImage(id);
  }

  @Get()
  async getSaveImage(
    @AuthUser() user: User,
    @Query('imageId') imageId: number,
  ): Promise<GetSaveImageDto> {
    return await this.saveImageService.getSaveImage(imageId, user);
  }
}
