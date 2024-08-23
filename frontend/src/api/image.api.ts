import {
  validateCreateImagePinInfo,
  validateFileInfo,
  validateImageDetailInfo,
  validateImageId,
  validateImagePinInfo,
  validateMainImageInfo,
  validateSearchImageInfo,
  validateSearchWord,
} from '../validator/image.validator';
import { commonValue } from './common.value';
import {
  ErrorResponse,
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
} from './types/image.data.type';

const PREFIX_URL = '/image';

type ImagePinResponse = { id: number; url: string };
type MainImageResponse = { id: number; url: string }[];
type SearchImageResponse = { id: number; url: string }[];
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
  moreImages: MoreImageResponse;
};
type ImageReplyResponse = {
  replyId: number;
  replyContent: string;
  userId: number;
  userName?: string;
};
type MoreImageResponse = { id: number; url: string }[];

export async function getMainImages(
  callback: (data: Response<MainImage> | ErrorResponse) => void,
) {
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/main`, {
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
  searchWord: string,
  callback: ResponseCallback<SearchImage>,
) {
  validateSearchWord(searchWord);

  try {
    const params = new URLSearchParams({
      'search-word': searchWord,
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}/search?${params}`;
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

    callback(searchImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
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
    images: res.map((d) => ({
      id: d.id,
      url: d.url,
    })),
  };
  validateMainImageInfo(data);

  return {
    data,
    success: true,
  };
}

function searchImageDataAdaptor(
  res: SearchImageResponse,
): Response<SearchImage> {
  const data = {
    images: res.map((d) => ({
      id: d.id,
      url: d.url,
    })),
  };
  validateSearchImageInfo(data);

  return {
    data,
    success: true,
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
      moreImages: {
        images: res.moreImages.map((image) => ({
          id: image.id,
          url: image.url,
        })),
      },
    },
  };
  validateImageDetailInfo(data);

  return {
    data,
    success: true,
  };
}
