import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from './image.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { ImageCategoryRepository } from 'src/image-category/image-category.repository';
import { SaveImageRepository } from 'src/save-image/save-image.repository';
import { UserRepository } from 'src/user/user.repository';
// import { StorageManager } from './storage/storage.manager';
import { ErrorMessage } from 'src/common/enum/error-message';
import { GetUploadImageDataDto } from './dto/get-upload-image-data.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { CreateMetaImageDto } from './dto/create-meta-image.dto';
import { GetImageDetailDto } from './dto/get-image-detail.dto';
import { GetImageReplyDto } from './dto/get-image-reply.dto';
import { GetImageDto } from './dto/get-image.dto';
import { UserImageHistoryRepository } from 'src/user-image-history/user-image-history.repository';
import { UserImageHistory } from 'src/user-image-history/entities/user-image-history.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageRepository)
    private readonly imageRepository: ImageRepository,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(ImageCategoryRepository)
    private readonly imageCategoryRepository: ImageCategoryRepository,
    @InjectRepository(SaveImageRepository)
    private readonly saveImageRepository: SaveImageRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserImageHistoryRepository)
    private readonly userImageHistoryRepository: UserImageHistoryRepository,
    // private readonly storageManager: StorageManager,
  ) {}

  // async uploadImage(
  //   createImageDto: CreateImageDto,
  // ): Promise<GetUploadImageDataDto> {
  //   const key = uuidv4(); // javascript UUID 라이브러리 찾아보기.
  //   let url = '';
  //   try {
  //     url = await this.storageManager.uploadFile(key, createImageDto);
  //   } catch (error) {
  //     throw new BadRequestException(ErrorMessage.FAIL_READ_INPUT_STREAM);
  //   }

  //   return new GetUploadImageDataDto(key, url);
  // }

  async addImage(createMetaImageDto: CreateMetaImageDto): Promise<number> {
    const user = await this.userRepository.findOneBy({
      id: createMetaImageDto.userId,
    });
    this.validateUser(user);

    await Promise.all(
      createMetaImageDto.categoryIds.map(async (categoryId) => {
        const category = await this.categoryRepository.findOneBy({
          id: categoryId,
        });
        this.validateCategory(category);
      }),
    );

    const image = this.imageRepository.create({
      title: createMetaImageDto.title,
      content: createMetaImageDto.content,
      key: createMetaImageDto.key,
      url: createMetaImageDto.url,
      user: user,
    });

    await this.imageRepository.save(image);

    const imageCategories = createMetaImageDto.categoryIds.map((categoryId) => {
      return this.imageCategoryRepository.create({ image, categoryId });
    });

    await this.imageCategoryRepository.save(imageCategories);

    return image.id;
  }

  async deleteImage(imageId: number): Promise<number> {
    const image = await this.imageRepository.findOneBy({ id: imageId });
    this.validateImage(image);

    // await this.deleteS3Image(image);
    await this.saveImageRepository.deleteSaveImageToImage(image);
    await this.imageRepository.remove(image);

    return imageId;
  }

  async findImage(id: number, userId: number): Promise<GetImageDetailDto> {
    const image = await this.imageRepository.findOneBy({ id });
    this.validateImage(image);

    const imageReplyResponses = image.imageReplies.map((imageReply) => {
      return GetImageReplyDto.of(imageReply);
    });

    const imageCategories = image.imageCategories;
    const categoryIds = imageCategories.map(
      (imageCategory) => imageCategory.categoryId,
    );

    const moreImages =
      await this.imageRepository.findImagesWithSimilarCategories(
        categoryIds,
        id,
      );

    if (userId !== -1) {
      await this.addUserImageHistory(image, userId);
    }

    return GetImageDetailDto.of(image, imageReplyResponses, moreImages);
  }

  async getMainImages(userId: number): Promise<GetImageDto[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    this.validateUser(user);

    const images = await this.imageRepository.getImageFromImageHistory(user);
    const categoryIds =
      await this.imageRepository.getImageCategoryIdFromImages(images);
    const recommendRandomImages =
      await this.imageRepository.getRecommendRandomImages(categoryIds);

    return GetImageDto.of(recommendRandomImages);
  }

  async getSearchImages(searchStr: string): Promise<GetImageDto[]> {
    this.validateSearchString(searchStr);

    const imageTitleOrContentRelationalImages =
      await this.imageRepository.getImageTitleOrContentRelationalImages(
        searchStr,
      );
    const imageCategories =
      await this.imageCategoryRepository.getCategoryFromSearchWord(searchStr);

    let categoryRelationalImages = [];
    if (imageCategories.length > 0) {
      categoryRelationalImages =
        await this.imageRepository.getCategoryRelationalImages(imageCategories);
    }

    return GetImageDto.of(
      this.combineList(
        categoryRelationalImages,
        imageTitleOrContentRelationalImages,
      ),
    );
  }

  async addUserImageHistory(image: Image, userId: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    this.validateUser(user);

    const userImageHistory: UserImageHistory =
      await this.userImageHistoryRepository.create({
        image,
        user,
      });

    user.addImageHistory(userImageHistory);
  }

  private validateImage(image: Image): void {
    if (!image) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_IMAGE);
    }
  }

  private validateUser(user: User): void {
    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_USER);
    }
  }

  private validateSearchString(searchStr: string): void {
    if (!searchStr.length) {
      throw new BadRequestException(ErrorMessage.CAN_NOT_SEARCH_STRING);
    }
  }

  private validateCategory(category: Category): void {
    if (!category) {
      throw new NotFoundException(ErrorMessage.NOT_EXIST_CATEGORY);
    }
  }

  // private async deleteS3Image(image: Image): Promise<void> {
  //   await this.storageManager.deleteFile(image.key);
  // }

  private combineList(a: Image[], b: Image[]): Image[] {
    const result = new Map<number, Image>();

    a.concat(b).forEach((image) => {
      if (!result.has(image.id)) {
        result.set(image.id, image);
      }
    });

    return Array.from(result.values());
  }
}
