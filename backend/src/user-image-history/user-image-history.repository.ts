import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserImageHistory } from './entities/user-image-history.entity';

@Injectable()
export class UserImageHistoryRepository extends Repository<UserImageHistory> {}
