export interface CreateFileDto {
  inputStream: Express.Multer.File;
  contentType?: string;
  contentLength?: number;
}
