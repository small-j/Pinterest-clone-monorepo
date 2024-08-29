import {
  validateCreateImagePinInfo,
  validateFileInfo,
  validateImageDetailInfo,
  validateImageId,
  validateImagePinInfo,
  validateMainImageInfo,
  validatePaginationParams,
  validateSearchWord,
  validateSeedParams,
  validateSimilarCategoriesImageInfo,
} from '../validator/image.validator';
import { commonValue } from '../common.value';
import {
  ErrorResponse,
  PaginationParams,
  Response,
  ResponseCallback,
} from './types/common.data.type';
import {
  FileInfo,
  CreateImagePinInfo,
  MainImage,
  SearchImage,
  ImagePin,
  ImageDetailsInfo,
  SimilarCategoriesImage,
} from './types/image.data.type';

const PREFIX_URL = '/image';

type ImagePinResponse = { id: number; url: string };
type MainImageResponse = {
  paginationData: {
    size: number;
    page: number;
    totalPage: number;
    totalCount: number;
    isLastPage: boolean;
  };
  images: { id: number; url: string }[];
  seed: number;
};
type SearchImageResponse = {
  paginationData: {
    size: number;
    page: number;
    totalPage: number;
    totalCount: number;
    isLastPage: boolean;
  };
  images: { id: number; url: string }[];
};
type FileInfoResponse = { key: string; url: string };
type ImageDetailsResponse = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  userId: number;
  userName: string;
  userEmail: string;
  imageReplies: ImageReplyResponse[];
};
type SimilarCategoriesImageResponse = {
  paginationData: {
    size: number;
    page: number;
    totalPage: number;
    totalCount: number;
    isLastPage: boolean;
  };
  images: { id: number; url: string }[];
};
type ImageReplyResponse = {
  replyId: number;
  replyContent: string;
  userId: number;
  userName?: string;
};

export async function getMainImages(
  paginationParams: PaginationParams,
  callback: (data: Response<MainImage> | ErrorResponse) => void,
  seed?: number,
) {
  validatePaginationParams(paginationParams);
  if (seed) validateSeedParams(seed);

  try {
    const params = new URLSearchParams({
      size: paginationParams.size.toString(),
      page: paginationParams.page.toString(),
    });
    if (seed) params.set('seed', seed.toString());

    const url = `${commonValue.ORIGIN}${PREFIX_URL}/main?${params.toString()}`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    callback(mainImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
  }
}

export async function getSearchImages(
  paginationParams: PaginationParams,
  searchWord: string,
): Promise<SearchImageResponse> {
  
  try {
    validateSearchWord(searchWord);
    validatePaginationParams(paginationParams);

    const params = new URLSearchParams({
      size: paginationParams.size.toString(),
      page: paginationParams.page.toString(),
      'search-word': searchWord,
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}/search?${params}`;

    return await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        throw new Error('이미지 로드 실패');
      }
      return res.json();
    });
  } catch (error) {
    throw new Error((error as Error).message || '이미지 로드 실패');
  }
}

export async function getImageDetails(
  id: number,
  callback: ResponseCallback<ImageDetailsInfo>,
) {
  validateImageId(id);

  try {
    const params = new URLSearchParams({
      id: id.toString(),
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}?${params}`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    callback(imageDetailsDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 세부 정보 로드 실패',
      success: false,
    });
  }
}

export async function getImageWithSimilarCategories(
  id: number,
  paginationParams: PaginationParams,
  callback: ResponseCallback<SimilarCategoriesImage>,
) {
  validateImageId(id);
  validatePaginationParams(paginationParams);

  try {
    const params = new URLSearchParams({
      id: id.toString(),
      size: paginationParams.size.toString(),
      page: paginationParams.page.toString(),
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}/similar-categories?${params}`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    callback(similarCategoriesImageDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '유사 카테고리 이미지 로드 실패',
      success: false,
    });
  }
}

export async function uploadImage(
  file: File,
  callback: (data: Response<FileInfo> | ErrorResponse) => void,
) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}`, {
      method: 'POST',
      body: formData,
      headers: {
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    return callback(imageFileDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 업로드 실패',
      success: false,
    });
  }
}

export async function createImagePin(
  imagePinInfo: CreateImagePinInfo,
  callback: (data: Response<ImagePin> | ErrorResponse) => void,
) {
  validateCreateImagePinInfo(imagePinInfo);

  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/meta`, {
      method: 'POST',
      body: JSON.stringify({
        title: imagePinInfo.title,
        content: imagePinInfo.content,
        key: imagePinInfo.key,
        url: imagePinInfo.url,
        categoryIds: imagePinInfo.categoryIds,
      }),
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    return callback(imagePinDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 생성 실패',
      success: false,
    });
  }
}

export async function deleteImagePin(
  id: number,
  callback: (data: Response<ImagePin> | ErrorResponse) => void,
) {
  validateImageId(id);

  try {
    const params = new URLSearchParams({
      id: id.toString(),
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}?${params}`;
    const result = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    return callback(imagePinDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 삭제 실패',
      success: false,
    });
  }
}

function imagePinDataAdaptor(res: ImagePinResponse): Response<ImagePin> {
  const data = {
    id: res.id,
    url: res.url,
  };
  validateImagePinInfo(data);

  return {
    data,
    success: true,
  };
}

function mainImageDataAdaptor(res: MainImageResponse): Response<MainImage> {
  const data = {
    paginationInfo: {
      size: res.paginationData.size,
      page: res.paginationData.page,
      totalPage: res.paginationData.totalPage,
      totalCount: res.paginationData.totalCount,
      isLastPage: res.paginationData.isLastPage,
    },
    imagePins: {
      images: res.images.map((d) => ({
        id: d.id,
        url: d.url,
      })),
    },
    seed: res.seed,
  };
  validateMainImageInfo(data);

  return {
    data,
    success: true,
  };
}

export function searchImageDataAdaptor(
  res: SearchImageResponse,
): SearchImage {
  return {
    paginationInfo: {
      size: res.paginationData.size,
      page: res.paginationData.page,
      totalPage: res.paginationData.totalPage,
      totalCount: res.paginationData.totalCount,
      isLastPage: res.paginationData.isLastPage,
    },
    imagePins: {
      images: res.images.map((d) => ({
        id: d.id,
        url: d.url,
      })),
    },
  };
}

function imageFileDataAdaptor(res: FileInfoResponse): Response<FileInfo> {
  const data = {
    fileMetaData: {
      key: res.key,
      url: res.url,
    },
  };
  validateFileInfo(data);

  return {
    data,
    success: true,
  };
}

function imageDetailsDataAdaptor(
  res: ImageDetailsResponse,
): Response<ImageDetailsInfo> {
  const data = {
    imageDetails: {
      id: res.id,
      title: res.title,
      content: res.content,
      url: res.imageUrl,
      userId: res.userId,
      userName: res.userName,
      userEmail: res.userEmail,
      replies: res.imageReplies.map((reply) => ({
        id: reply.replyId,
        content: reply.replyContent,
        userId: reply.userId,
        userName: !reply.userName ? '' : reply.userName,
      })),
    },
  };
  validateImageDetailInfo(data);

  return {
    data,
    success: true,
  };
}

function similarCategoriesImageDataAdaptor(
  res: SimilarCategoriesImageResponse,
): Response<SimilarCategoriesImage> {
  const data = {
    paginationInfo: {
      size: res.paginationData.size,
      page: res.paginationData.page,
      totalPage: res.paginationData.totalPage,
      totalCount: res.paginationData.totalCount,
      isLastPage: res.paginationData.isLastPage,
    },
    imagePins: {
      images: res.images.map((d) => ({
        id: d.id,
        url: d.url,
      })),
    },
  };
  validateSimilarCategoriesImageInfo(data);

  return {
    data,
    success: true,
  };
}
