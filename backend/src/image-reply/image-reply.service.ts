import { Injectable } from '@nestjs/common';
import { CreateImageReplyDto } from './dto/create-image-reply.dto';

@Injectable()
export class ImageReplyService {
  create(createImageReplyDto: CreateImageReplyDto) {
    return 'This action adds a new imageReply';
  }

  findAll() {
    return `This action returns all imageReply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageReply`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageReply`;
  }
}
