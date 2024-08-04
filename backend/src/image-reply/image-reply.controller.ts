import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ImageReplyService } from './image-reply.service';
import { CreateImageReplyDto } from './dto/create-image-reply.dto';

@Controller('image-reply')
export class ImageReplyController {
  constructor(private readonly imageReplyService: ImageReplyService) {}

  @Post()
  create(@Body() createImageReplyDto: CreateImageReplyDto) {
    return this.imageReplyService.create(createImageReplyDto);
  }

  @Get()
  findAll() {
    return this.imageReplyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageReplyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageReplyService.remove(+id);
  }
}
