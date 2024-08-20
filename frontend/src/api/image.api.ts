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

type MainImageResponse = { id: number; url: string }[];
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
    }).then((res) => res.json());

    callback(mainImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
  }
}

function mainImageDataAdaptor(res: MainImageResponse): Response<MainImage> {
  return {
    data: {
      images: res.map((d) => ({
        id: d.id,
        url: d.url,
      })),
    },
    success: true,
  };
}

type SearchImageResponse = { id: number; url: string }[];

export async function getSearchImages(
  searchWord: string,
  callback: ResponseCallback<SearchImage>,
) {
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
    }).then((res) => res.json());

    callback(searchImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
  }
}

function searchImageDataAdaptor(
  res: SearchImageResponse,
): Response<SearchImage> {
  return {
    data: {
      images: res.map((d) => ({
        id: d.id,
        url: d.url,
      })),
    },
    success: true,
  };
}

export async function getImageDetails(
  id: string,
  callback: ResponseCallback<ImageDetailsInfo>,
) {
  try {
    const params = new URLSearchParams({
      'id': id,
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}?${params}`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => res.json());

    callback(imageDetailsDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 세부 정보 로드 실패', success: false });
  }
}

function imageDetailsDataAdaptor(
  res: ImageDetailsResponse,
): Response<ImageDetailsInfo> {
  return {
    data: {
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
    },
    success: true,
  };
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
      if (res.status !== 201) throw new Error();
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

function imageFileDataAdaptor(res: FileInfoResponse): Response<FileInfo> {
  return {
    data: {
      fileMetaData: {
        key: res.key,
        url: res.url,
      },
    },
    success: true,
  };
}

export async function createImagePin(
  imagePinInfo: CreateImagePinInfo,
  callback: (data: Response<ImagePin> | ErrorResponse) => void,
) {
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
    }).then((res) => res.json());

    return callback({ data: result, success: true });
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 생성 실패',
      success: false,
    });
  }
}

export async function deleteImagePin(
  id: string,
  callback: (data: Response<ImagePin> | ErrorResponse) => void,
) {
  try {
    const params = new URLSearchParams({
      'id': id,
    }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}?${params}`;
    const result = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => res.json());

    return callback({ data: result, success: true });
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 삭제 실패',
      success: false,
    });
  }
}
