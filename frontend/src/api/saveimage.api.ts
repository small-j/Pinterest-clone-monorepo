import { validateImageId } from '../validator/image.validator';
import {
  validateDeleteSaveImageInfo,
  validateSaveImageId,
  validateSaveImageInfo,
} from '../validator/saveimage.validator';
import { commonValue } from '../common.value';
import { ErrorResponse, Response } from './types/common.data.type';
import {
  SaveImageDeleteInfo,
  SaveImageInfo,
} from './types/saveimage.data.type';

const PREFIX_URL = '/save-image';

export type SaveImageInfoResponse = {
  id: number;
  imageMetaId: number;
  userId: number;
};

interface SaveImageDeleteResponse {
  id: number;
}

export async function getSaveImage(
  id: number,
  callback: (data: Response<SaveImageInfo> | ErrorResponse) => void,
) {
  validateSaveImageId(id);

  const params = new URLSearchParams({
    imageId: id.toString(),
  }).toString();
  const url = `${commonValue.ORIGIN}${PREFIX_URL}?${params}`;
  try {
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

    callback(saveImageDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 저장 정보 로드 실패',
      success: false,
    });
  }
}

export async function createSaveImage(
  imageId: number,
  callback: (data: Response<SaveImageInfo> | ErrorResponse) => void,
) {
  validateImageId(imageId);

  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        imageMetaId: imageId,
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

    return callback(saveImageDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 저장 실패',
      success: false,
    });
  }
}

export async function deleteSaveImage(
  id: number,
  callback: (data: Response<SaveImageDeleteInfo> | ErrorResponse) => void,
) {
  validateSaveImageId(id);

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

    return callback(saveImageDeleteAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 저장 정보 삭제 실패',
      success: false,
    });
  }
}

function saveImageDataAdaptor(
  res: SaveImageInfoResponse,
): Response<SaveImageInfo> {
  const data = {
    id: res.id,
    imageId: res.imageMetaId,
    userId: res.userId,
  };
  validateSaveImageInfo(data);

  return {
    data,
    success: true,
  };
}

function saveImageDeleteAdaptor(
  res: SaveImageDeleteResponse,
): Response<SaveImageDeleteInfo> {
  const data = {
    id: res.id,
  };
  validateDeleteSaveImageInfo(data);

  return {
    data,
    success: true,
  };
}
