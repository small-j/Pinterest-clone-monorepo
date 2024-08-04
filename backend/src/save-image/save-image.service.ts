import { Injectable } from '@nestjs/common';
import { CreateSaveImageDto } from './dto/create-save-image.dto';

@Injectable()
export class SaveImageService {
  create(createSaveImageDto: CreateSaveImageDto) {
    return 'This action adds a new saveImage';
  }

  findAll() {
    return `This action returns all saveImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saveImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} saveImage`;
  }
}
