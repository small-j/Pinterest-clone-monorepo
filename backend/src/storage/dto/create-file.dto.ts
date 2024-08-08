export interface CreateFileDto {
  //   inputStream: NodeJS.ReadableStream;
  inputStream: Express.Multer.File;
  contentType?: string;
  contentLength?: number;
}
