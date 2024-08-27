import { useNavigate, useParams } from 'react-router-dom';
import { getSearchImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { SearchImage } from '../api/types/image.data.type';
import {
  ErrorResponse,
  Response,
} from '../api/types/common.data.type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { commonValue } from '../common.value';

function SearchPage() {
  const param = useParams();
  const [imageDatas, setImageDatas] = useState<
    Response<SearchImage> | ErrorResponse
  >();
  const page = useRef<number>(1);
  const [isFetching, setFetching] = useState(false);
  const isLastPage = useMemo<boolean>(() => {
    if (!imageDatas || !imageDatas.data) return true;
    return imageDatas.data.paginationInfo.isLastPage;
  }, [imageDatas]);

  useEffect(() => {
    setImageDatas(undefined); // 초기화. 추후 ImagePinList 마운트 되도록.
    page.current = 1;
    requestSearchImages();
  }, [param.searchWord]);

  const requestSearchImages = useCallback(() => {
    const searchWord = param.searchWord;
    if (!searchWord || searchWord === '') {
      useNavigate()('/');
      return;
    }
    if (!visualViewport) return;

    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport);
    const callback = (res: Response<SearchImage> | ErrorResponse) => {
      setImageDatas(res);
      page.current = page.current + 1;
      setFetching(false);
    };

    getSearchImages({ size, page: page.current }, searchWord, callback);
    setFetching(true);
  }, [param.searchWord]);

  const isErrorResponse = (
    response: Response<SearchImage> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  return (
    <div className="w-full flex flex-wrap justify-center">
      {!imageDatas && <div>loading...</div>}
      {isErrorResponse(imageDatas) && <div>{imageDatas.errorMessage}</div>}
      {imageDatas?.success && imageDatas.data && (
        <ImagePinList
          imageDatas={imageDatas.data.imagePins}
          fetchData={requestSearchImages}
          isFetching={isFetching}
          isLastPage={isLastPage}
        ></ImagePinList>
      )}
    </div>
  );
}
export default SearchPage;
