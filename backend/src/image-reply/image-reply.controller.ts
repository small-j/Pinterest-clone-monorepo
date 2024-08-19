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
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GetImageReplyDto } from './dto/get-image-reply.dto';

@Controller('reply')
export class ImageReplyController {
  constructor(private readonly imageReplyService: ImageReplyService) {}

  @Post()
  async addReply(
    @AuthUser() user: User,
    @Body() imageReplyRequest: CreateImageReplyDto,
  ): Promise<GetImageReplyDto> {
    return await this.imageReplyService.addReply(user, imageReplyRequest);
  }

  @Delete()
  @UseGuards(RolesGuard)
  async deleteReply(@Query('id') id: number): Promise<number> {
    return await this.imageReplyService.deleteReply(id);
  }
}
