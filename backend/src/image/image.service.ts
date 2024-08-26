import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from './image.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { ImageCategoryRepository } from 'src/image-category/image-category.repository';
import { UserRepository } from 'src/user/user.repository';
import { ErrorMessage } from 'src/common/enum/error-message';
import { GetUploadImageDataDto } from './dto/get-upload-image-data.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { CreateMetaImageDto } from './dto/create-meta-image.dto';
import { GetImageDetailDto } from './dto/get-image-detail.dto';
import { GetImageReplyDto } from './dto/get-image-reply.dto';
import { GetImageDto } from './dto/get-image.dto';
import { UserImageHistoryRepository } from 'src/user-image-history/user-image-history.repository';
import { UserImageHistory } from 'src/user-image-history/entities/user-image-history.entity';
import { DeleteSaveImageToImageHelperRepository } from 'src/save-image-helper/save-image-helper.repository';
import { CustomStorageManager } from 'src/storage/storage-manager.interface';
import { FindImageRepliesWithUserByImageHelperRepository } from 'src/image-reply-helper/image-reply-helper.repository';
import { GetImagesDto } from './dto/get-images.dto';
import { GetPaginationDataDto } from './dto/get-pagination-data.dto';

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
    @InjectRepository(FindImageRepliesWithUserByImageHelperRepository)
    private readonly imageReplyRepository: FindImageRepliesWithUserByImageHelperRepository,
    @Inject('CustomStorageManager')
    private readonly storageManager: CustomStorageManager,
  ) {}

  async uploadImage(
    createImageDto: CreateImageDto,
  ): Promise<GetUploadImageDataDto> {
    const key = crypto.randomUUID();
    let url = '';
    try {
      url = await this.storageManager.uploadFile(key, createImageDto);
    } catch (error) {
      throw new BadRequestException(ErrorMessage.FAIL_READ_INPUT_STREAM);
    }

    return new GetUploadImageDataDto(key, url);
  }

  async addImage(
    user: User,
    createMetaImageDto: CreateMetaImageDto,
  ): Promise<GetImageDto> {
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

    return new GetImageDto(image.id, image.url);
  }

  async deleteImage(imageId: number): Promise<GetImageDto> {
    const image = await this.imageRepository.findOneBy({ id: imageId });
    this.validateImage(image);
    const response = new GetImageDto(image.id, image.url);

    await this.deleteS3Image(image);
    await this.deleteSaveImageToImageHelperRepository.deleteSaveImageToImage(
      image,
    );
    await this.userImageHistoryRepository.removeUserImageHistoryFromImage(
      image,
    );
    await this.imageRepository.remove(image);

    return response;
  }

  async findImage(id: number, user: User): Promise<GetImageDetailDto> {
    const image =
      await this.imageRepository.findImageWithUserWithImageCategory(id);
    this.validateImage(image);

    const imageReplies =
      await this.imageReplyRepository.findByImageWithUser(image);

    const imageReplyResponses = imageReplies.map((imageReply) => {
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

    await this.addUserImageHistory(image, user.id);

    return GetImageDetailDto.of(
      image,
      image.user,
      imageReplyResponses,
      moreImages,
    );
  }

  async getMainImages(
    user: User,
    size: number,
    page: number,
    seed?: number,
  ): Promise<GetImagesDto> {
    this.validateUser(user);
    if (size <= 0 || page <= 0) throw new BadRequestException();

    const userImageHistories =
      await this.userImageHistoryRepository.findUserImageHistoriesWithImages(
        user.id,
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

    if (!seed) {
      const now = Date.now();
      seed = now / Math.pow(10, now.toString().length);
    }
    // 카테고리 id를 기반으로 뽑은 추천 이미지.
    const { data, count } = await this.imageRepository.getRecommendRandomImages(
      categories,
      size,
      page,
      seed,
    );

    const totalPage = Math.ceil(count / size);
    if (totalPage < page) throw new BadRequestException();

    const paginationData = new GetPaginationDataDto(
      size,
      page,
      totalPage,
      count,
      page === totalPage,
    );

    return GetImagesDto.of(data, paginationData, seed);
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

  private async deleteS3Image(image: Image): Promise<void> {
    await this.storageManager.deleteFile(image.key);
  }

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
