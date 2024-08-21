import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { GetUploadImageDataDto } from './dto/get-upload-image-data.dto';
import { CreateMetaImageDto } from './dto/create-meta-image.dto';
import { GetImageDetailDto } from './dto/get-image-detail.dto';
import { GetImageDto } from './dto/get-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/guard/roles-guard';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() req: Express.Multer.File,
  ): Promise<GetUploadImageDataDto> {
    const imageRequest = new CreateImageDto(req);
    return await this.imageService.uploadImage(imageRequest);
  }

  @Post('/meta')
  async addImage(
    @AuthUser() user: User,
    @Body() imageMetaRequest: CreateMetaImageDto,
  ): Promise<GetImageDto> {
    return await this.imageService.addImage(user, imageMetaRequest);
  }

  @Delete()
  @UseGuards(RolesGuard)
  async deleteImage(@Query('id') id: number): Promise<GetImageDto> {
    return await this.imageService.deleteImage(id);
  }

  @Get()
  async findImage(
    @Query('id') id: number,
    @AuthUser() user: User,
  ): Promise<GetImageDetailDto> {
    return await this.imageService.findImage(id, user);
  }

  @Get('/search')
  async searchImage(
    @Query('search-word') searchWord: string,
  ): Promise<GetImageDto[]> {
    return await this.imageService.getSearchImages(searchWord);
  }

  @Get('/main')
  async mainImage(@AuthUser() user: User): Promise<GetImageDto[]> {
    return await this.imageService.getMainImages(user);
  }
}
