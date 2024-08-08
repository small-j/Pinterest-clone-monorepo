import { CreateFileDto } from 'src/storage/dto/create-file.dto';

export class CreateImageDto implements CreateFileDto {
  inputStream: Express.Multer.File;

  constructor(inputStream: Express.Multer.File) {
    this.inputStream = inputStream;
  }
}
