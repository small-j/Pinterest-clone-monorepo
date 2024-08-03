import { Injectable } from '@nestjs/common';
import { CreateUserImageHistoryDto } from './dto/create-user-image-history.dto';

@Injectable()
export class UserImageHistoryService {
  create(createUserImageHistoryDto: CreateUserImageHistoryDto) {
    return 'This action adds a new userImageHistory';
  }

  findAll() {
    return `This action returns all userImageHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userImageHistory`;
  }
}
