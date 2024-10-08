import { Image } from '../entities/image.entity';
import { GetImageDto } from './get-image.dto';
import { GetPaginationDataDto } from './get-pagination-data.dto';

export class GetImagesDto {
  images: GetImageDto[];
  paginationData: GetPaginationDataDto;

  constructor(images: GetImageDto[], paginationData: GetPaginationDataDto) {
    this.images = images;
    this.paginationData = paginationData;
  }

  static of(
    images: Image[],
    paginationData: GetPaginationDataDto,
  ): GetImagesDto {
    return new GetImagesDto(
      images.map((image) => new GetImageDto(image.id, image.url)),
      paginationData,
    );
  }
}
