import {
  Controller,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ImageReplyService } from './image-reply.service';
import { CreateImageReplyDto } from './dto/create-image-reply.dto';
import { RolesGuard } from 'src/guard/roles-guard';

@Controller('reply')
export class ImageReplyController {
  constructor(private readonly imageReplyService: ImageReplyService) {}

  @Post()
  async addReply(
    @Body() imageReplyRequest: CreateImageReplyDto,
  ): Promise<number> {
    return await this.imageReplyService.addReply(imageReplyRequest);
  }

  @Delete()
  @UseGuards(RolesGuard)
  async deleteReply(@Query('id') id: number): Promise<number> {
    return await this.imageReplyService.deleteReply(id);
  }
}
