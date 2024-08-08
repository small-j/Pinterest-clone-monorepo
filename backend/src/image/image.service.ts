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
import { UserRepository } from 'src/user/user.repository';
// import { StorageManager } from './storage/storage.manager';
import { ErrorMessage } from 'src/common/enum/error-message';
// import { GetUploadImageDataDto } from './dto/get-upload-image-data.dto';
// import { CreateImageDto } from './dto/create-image.dto';
import { CreateMetaImageDto } from './dto/create-meta-image.dto';
import { GetImageDetailDto } from './dto/get-image-detail.dto';
import { GetImageReplyDto } from './dto/get-image-reply.dto';
import { GetImageDto } from './dto/get-image.dto';
import { UserImageHistoryRepository } from 'src/user-image-history/user-image-history.repository';
import { UserImageHistory } from 'src/user-image-history/entities/user-image-history.entity';
import { DeleteSaveImageToImageHelperRepository } from 'src/save-image-helper/save-image-helper.repository';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageRepository)
    private readonly imageRepository: ImageRepository,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(ImageCategoryRepository)
    private readonly imageCategoryRepository: ImageCategoryRepository,
    @InjectRepository(DeleteSaveImageToImageHelperRepository)
    private readonly deleteSaveImageToImageHelperRepository: DeleteSaveImageToImageHelperRepository,
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
    const categories = await Promise.all(
      createMetaImageDto.categoryIds.map(
        async (categoryId) =>
          await this.categoryRepository.findOneBy({
            id: categoryId,
          }),
      ),
    );
    categories.forEach((category) => this.validateCategory(category));

    const image = this.imageRepository.create({
      title: createMetaImageDto.title,
      content: createMetaImageDto.content,
      key: createMetaImageDto.key,
      url: createMetaImageDto.url,
      user: user,
    });
    await this.imageRepository.save(image);

    const imageCategories = categories.map((category) => {
      return this.imageCategoryRepository.create({ image, category });
    });
    await this.imageCategoryRepository.save(imageCategories);

    return image.id;
  }

  async deleteImage(imageId: number): Promise<number> {
    const image = await this.imageRepository.findOneBy({ id: imageId });
    this.validateImage(image);

    // await this.deleteS3Image(image);
    await this.deleteSaveImageToImageHelperRepository.deleteSaveImageToImage(
      image,
    );
    // TODO: userImageHistory 지워주기.
    await this.imageRepository.remove(image);

    return imageId;
  }

  async findImage(id: number, userId: number): Promise<GetImageDetailDto> {
    const image =
      await this.imageRepository.findImageWithImageReplyWithImageCategory(id);
    this.validateImage(image);

    const imageReplyResponses = image.imageReplies.map((imageReply) => {
      return GetImageReplyDto.of(imageReply);
    });

    const categories = await Promise.all(
      (
        await this.imageCategoryRepository.findOneWithCategory(
          image.imageCategories,
        )
      ).map((imageCategory) => imageCategory.category),
    );
    const moreImages =
      await this.imageRepository.findImagesWithSimilarCategories(
        categories,
        id,
      );

    if (userId !== -1) {
      await this.addUserImageHistory(image, userId);
    }

    return GetImageDetailDto.of(image, imageReplyResponses, moreImages);
  }

  async getMainImages(userId: number): Promise<GetImageDto[]> {
    const user =
      await this.userRepository.findOneWithUserImageHistories(userId);
    this.validateUser(user);

    const userImageHistories =
      await this.userImageHistoryRepository.findUserImageHistoriesWithImages(
        user.userImageHistories,
      );
    // 조회한 이미지.
    const images = await Promise.all(
      userImageHistories.map((userImageHistory) => userImageHistory.image),
    );
    // 조회한 이미지 카테고리.
    const imageCategories =
      await this.imageCategoryRepository.findImageCategoriesFromImages(images);
    const categories = await Promise.all(
      imageCategories.map((imageCategory) => imageCategory.category),
    );
    // 카테고리 id를 기반으로 뽑은 추천 이미지.
    const recommendRandomImages =
      await this.imageRepository.getRecommendRandomImages(categories);

    return GetImageDto.of(recommendRandomImages);
  }

  async getSearchImages(searchStr: string): Promise<GetImageDto[]> {
    this.validateSearchString(searchStr);

    const imageTitleOrContentRelationalImages =
      await this.imageRepository.getImageTitleOrContentRelationalImages(
        searchStr,
      );
    const imageCategories =
      await this.imageCategoryRepository.getImageCategoryFromSearchWord(
        searchStr,
      ); // TODO: Category 중복 제거할 방법 찾기.
    const categories = await Promise.all(
      imageCategories.map((imageCategory) => imageCategory.category),
    );

    let categoryRelationalImages = [];
    if (imageCategories.length > 0) {
      categoryRelationalImages =
        await this.imageRepository.getCategoryRelationalImages(categories);
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

    this.userImageHistoryRepository.save(userImageHistory);
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
