import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { CustomStorageManager } from './storage-manager.interface';
import { CreateImageDto } from 'src/image/dto/create-image.dto';

@Injectable()
export class AWSS3StorageService implements CustomStorageManager {
  private readonly s3: S3;
  private readonly BUCKET_NAME: string;
  private readonly LOCATION: string;

  constructor(
    @Inject('AWS_S3_CLIENT') s3: S3,
    private readonly configService: ConfigService,
  ) {
    this.s3 = s3;
    this.BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');
    this.LOCATION = this.configService.get<string>('AWS_REGION');
  }

  async uploadFile(
    filename: string,
    fileRequest: CreateImageDto,
  ): Promise<string> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: filename,
      Body: fileRequest.inputStream.buffer,
      // ACL: ObjectCannedACL.public_read,
    };

    // TODO: 업로드 성공했는지 여부 체크 필요.
    await this.s3.upload(params).promise();

    return this.getFilePath(filename);
  }

  private getFilePath(filename: string): string {
    return `https://${this.BUCKET_NAME}.s3.${this.LOCATION}.amazonaws.com/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: filename,
    };

    await this.s3.deleteObject(params).promise();
  }
}
