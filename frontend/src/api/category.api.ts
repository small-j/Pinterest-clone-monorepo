import { commonValue } from './common.value';
import { CategoryInfo } from './types/category.data.type';
import { ErrorResponse, Response } from './types/common.data.type';

const PREFIX_URL = '/category';

type CategoryInfoResponse = { id: number; name: string }[];

export async function getCategories(
  callback: (data: Response<CategoryInfo[]> | ErrorResponse) => void,
) {
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    });

    callback(categoryDataAdaptor(result));
  } catch {
    callback({ data: null, errorMessage: '카테고리 로드 실패', success: false });
  }
}

function categoryDataAdaptor(
  res: CategoryInfoResponse,
): Response<CategoryInfo[]> {
  const data = res.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return {
    data,
    success: true,
  };
}
