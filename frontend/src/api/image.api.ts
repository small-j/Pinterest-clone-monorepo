import { commonValue } from './common.value';
import { ErrorResponse, Response } from './types/common.data.type';
import { MainImage } from './types/image.data.type';

const PREFIX_URL = '/image';

type MainImageResponse = { id: number; url: string }[];

export async function getMainImages(
  callback: (data: Response<MainImage> | ErrorResponse) => void,
) {
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}/main`, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: "include",
    }).then((res) => res.json());

    callback(mainImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
  }
}

function mainImageDataAdaptor(res: MainImageResponse): Response<MainImage> {
  return {
    data: {
      images:
        res.map((d) => ({
          id: d.id,
          url: d.url,
        })),
    },
    success: true,
  };
}
