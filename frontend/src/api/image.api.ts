import { commonValue } from './common.value';
import { ErrorResponse, Response, ResponseCallback } from './types/common.data.type';
import { MainImage, SearchImage } from './types/image.data.type';

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

type SearchImageResponse = { id: number; url: string }[];

export async function getSearchImages(
  searchWord: string,
  callback: ResponseCallback<SearchImage>,
) {
  try {
    const params = new URLSearchParams({ 'search-word': searchWord }).toString();
    const url = `${commonValue.ORIGIN}${PREFIX_URL}/search?${params}`;
    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: "include",
    }).then((res) => res.json());

    callback(searchImageDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '이미지 로드 실패', success: false });
  }
}

function searchImageDataAdaptor(res: SearchImageResponse): Response<SearchImage> {
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
