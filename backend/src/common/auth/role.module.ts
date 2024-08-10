import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { SaveImageHelperModule } from 'src/save-image-helper/save-image-helper.module';
import { ImageReplyHelperModule } from 'src/image-reply-helper/image-reply-helper.module';
import { ImageHelperModule } from 'src/image-helper/image-helper.module';

@Module({
  imports: [SaveImageHelperModule, ImageReplyHelperModule, ImageHelperModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
