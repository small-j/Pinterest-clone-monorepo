import { Image } from '../entities/image.entity';
import { GetImageDto } from './get-image.dto';
import { GetPaginationDataDto } from './get-pagination-data.dto';

export class GetImagesDto {
  images: GetImageDto[];
  paginationData: GetPaginationDataDto;
  seed: number;

  constructor(
    images: GetImageDto[],
    paginationData: GetPaginationDataDto,
    seed: number,
  ) {
    this.images = images;
    this.paginationData = paginationData;
    this.seed = seed;
  }

  static of(
    images: Image[],
    paginationData: GetPaginationDataDto,
    seed: number,
  ): GetImagesDto {
    return new GetImagesDto(
      images.map((image) => new GetImageDto(image.id, image.url)),
      paginationData,
      seed,
    );
  }
}
