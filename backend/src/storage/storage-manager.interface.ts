import { CreateFileDto } from './dto/create-file.dto';

export interface CustomStorageManager {
  uploadFile(
    filename: string,
    createFileRequest: CreateFileDto,
  ): Promise<string>;
  deleteFile(filename: string): Promise<void>;
}
