import { JSONSchemaType } from 'ajv';
import { commonValue } from '../common.value';
import {
  CreateImagePinInfo,
  FileInfo,
  ImageDetailsInfo,
  ImagePin,
  MainImage,
  SearchImage,
} from '../api/types/image.data.type';
import { PaginationParams } from '../api/types/common.data.type';

const ignoreCharsRegex = '^[^\'";<>\\[\\](){}^$|?*+\\\\`&%#~]*$';

const idSchema = {
  type: 'integer',
  nullable: false,
};

export function validateImageId(id: number) {
  const validate = commonValue.AJV.compile(idSchema);
  const valid = validate(id);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid ID format');
  }
}

const searchWordSchema = {
  type: 'string',
  nullable: false,
  pattern: ignoreCharsRegex,
};

export function validateSearchWord(id: string) {
  const validate = commonValue.AJV.compile(searchWordSchema);
  const valid = validate(id);
  if (!valid) {
    throw new Error('Invalid search format');
  }
}

const paginationSchema = {
  type: 'object',
  properties: {
    size: { type: 'integer', nullable: false },
    page: { type: 'integer', nullable: false },
  },
  required: ['size', 'page'],
};

export function validatePaginationParams(param: PaginationParams) {
  const validate = commonValue.AJV.compile(paginationSchema);
  const valid = validate(param);
  if (!valid) {
    throw new Error('Invalid page param');
  }
}

const seedSchema = {
  type: 'number',
  nullable: false,
};

export function validateSeedParams(param: number) {
  const validate = commonValue.AJV.compile(seedSchema);
  const valid = validate(param);
  if (!valid) {
    throw new Error('Invalid seed param');
  }
}

const mainImageSchema: JSONSchemaType<MainImage> = {
  type: 'object',
  properties: {
    paginationInfo: {
      type: 'object',
      properties: {
        size: { type: 'integer', nullable: false },
        page: { type: 'integer', nullable: false },
        totalPage: { type: 'integer', nullable: false },
        totalCount: { type: 'integer', nullable: false },
        isLastPage: { type: 'boolean', nullable: false },
      },
      required: ['size', 'page', 'totalPage', 'totalCount', 'isLastPage'],
    },
    imagePins: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', nullable: false },
              url: { type: 'string', format: 'uri', nullable: false },
            },
            required: ['id', 'url'],
          },
        },
      },
      required: ['images'],
    },
    seed: {
      type: 'number',
      nullable: false,
    },
  },
  required: ['paginationInfo', 'imagePins', 'seed'],
};

export function validateMainImageInfo(response: MainImage) {
  const validate = commonValue.AJV.compile(mainImageSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid response format');
  }
}

const searchImageSchema: JSONSchemaType<SearchImage> = {
  type: 'object',
  properties: {
    paginationInfo: {
      type: 'object',
      properties: {
        size: { type: 'integer', nullable: false },
        page: { type: 'integer', nullable: false },
        totalPage: { type: 'integer', nullable: false },
        totalCount: { type: 'integer', nullable: false },
        isLastPage: { type: 'boolean', nullable: false },
      },
      required: ['size', 'page', 'totalPage', 'totalCount', 'isLastPage'],
    },
    imagePins: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', nullable: false },
              url: { type: 'string', format: 'uri', nullable: false },
            },
            required: ['id', 'url'],
          },
        },
      },
      required: ['images'],
    },
  },
  required: ['paginationInfo', 'imagePins'],
};

export function validateSearchImageInfo(response: SearchImage) {
  const validate = commonValue.AJV.compile(searchImageSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid response format');
  }
}

const imageDetailSchema: JSONSchemaType<ImageDetailsInfo> = {
  type: 'object',
  properties: {
    imageDetails: {
      type: 'object',
      properties: {
        id: { type: 'integer', nullable: false },
        title: { type: 'string' },
        content: { type: 'string' },
        url: { type: 'string', format: 'uri', nullable: false },
        userId: { type: 'integer', nullable: false },
        userName: { type: 'string' },
        userEmail: { type: 'string', format: 'email', nullable: false },
        replies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', nullable: false },
              content: { type: 'string' },
              userId: { type: 'integer', nullable: false },
              userName: { type: 'string', nullable: false },
            },
            required: ['id', 'content', 'userId', 'userName'],
          },
        },
        moreImages: {
          type: 'object',
          properties: {
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', nullable: false },
                  url: { type: 'string', format: 'uri', nullable: false },
                },
                required: ['id', 'url'],
              },
            },
          },
          required: ['images'],
        },
      },
      required: [
        'id',
        'title',
        'content',
        'url',
        'userId',
        'userName',
        'userEmail',
        'replies',
        'moreImages',
      ],
    },
  },
  required: ['imageDetails'],
};

export function validateImageDetailInfo(response: ImageDetailsInfo) {
  const validate = commonValue.AJV.compile(imageDetailSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid response format');
  }
}

const FileInfoSchema: JSONSchemaType<FileInfo> = {
  type: 'object',
  properties: {
    fileMetaData: {
      type: 'object',
      properties: {
        key: { type: 'string', nullable: false },
        url: { type: 'string', format: 'uri', nullable: false },
      },
      required: ['key', 'url'],
    },
  },
  required: ['fileMetaData'],
};

export function validateFileInfo(response: FileInfo) {
  const validate = commonValue.AJV.compile(FileInfoSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid response format');
  }
}

const createImagePinInfoSchema: JSONSchemaType<CreateImagePinInfo> = {
  type: 'object',
  properties: {
    title: { type: 'string', nullable: false },
    content: { type: 'string', nullable: false },
    key: { type: 'string', nullable: false },
    url: { type: 'string', format: 'uri', nullable: false },
    categoryIds: {
      type: 'array',
      items: { type: 'integer', nullable: false },
      nullable: false,
    },
  },
  required: ['content', 'key', 'url', 'categoryIds'],
};

export function validateCreateImagePinInfo(response: CreateImagePinInfo) {
  const validate = commonValue.AJV.compile(createImagePinInfoSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid request format');
  }
}

const ImagePinInfoSchema: JSONSchemaType<ImagePin> = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: false },
    url: { type: 'string', format: 'uri', nullable: false },
  },
  required: ['id', 'url'],
};

export function validateImagePinInfo(response: ImagePin) {
  const validate = commonValue.AJV.compile(ImagePinInfoSchema);
  const valid = validate(response);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Invalid response format');
  }
}
