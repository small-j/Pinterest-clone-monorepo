export class CreateImageDto {
  inputStream: NodeJS.ReadableStream;
  contentType: string;
  contentLength: number;
}
