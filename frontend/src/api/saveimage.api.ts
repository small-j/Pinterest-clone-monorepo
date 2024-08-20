import { commonValue } from './common.value';
import { ErrorResponse, Response } from './types/common.data.type';
import { SaveImageInfo } from './types/saveimage.data.type';

const PREFIX_URL = '/save-image';

type SaveImageInfoResponse = {
  id: number;
  imageId: number;
  userId: number;
};

export async function createSaveImage(
  imageId: number,
  callback: (data: Response<SaveImageInfo> | ErrorResponse) => void,
) {
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
    }).then((res) => res.json());

    return callback(saveImageDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 pin 저장 실패',
      success: false,
    });
  }
}

function saveImageDataAdaptor(
  res: SaveImageInfoResponse,
): Response<SaveImageInfo> {
  return {
    data: {
      id: res.id,
      imageId: res.imageId,
      userId: res.userId,
    },
    success: true,
  };
}
