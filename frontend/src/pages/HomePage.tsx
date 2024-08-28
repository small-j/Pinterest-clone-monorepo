import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMainImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { MainImage } from '../api/types/image.data.type';
import { commonValue } from '../common.value';

function HomePage() {
  const [imageDatas, setImageDatas] = useState<
    Response<MainImage> | ErrorResponse
  >();
  const page = useRef<number>(1);
  const [isFetching, setFetching] = useState(false);
  const isLastPage = useMemo<boolean>(() => {
    if (!imageDatas || !imageDatas.data) return true;
    return imageDatas.data.paginationInfo.isLastPage;
  }, [imageDatas]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(() => {
    if (!visualViewport) return;
    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport); 
    const callback = (res: Response<MainImage> | ErrorResponse) => {
      setImageDatas(res);
      page.current = page.current + 1;
      setFetching(false);
    };
    const seed = imageDatas?.data?.seed;

    if (seed) getMainImages({ size, page: page.current }, callback, seed);
    else getMainImages({ size, page: page.current }, callback);
    setFetching(true);
  }, [imageDatas]);

  const isErrorResponse = (
    response: Response<MainImage> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      {!imageDatas && <div>loading...</div>}
      {isErrorResponse(imageDatas) && <div>{imageDatas.errorMessage}</div>}
      {imageDatas && imageDatas.success && imageDatas.data && (
        <ImagePinList
          imageDatas={imageDatas.data.imagePins}
          fetchData={fetchData}
          isFetching={isFetching}
          isLastPage={isLastPage}
        ></ImagePinList>
      )}
    </div>
  );
}
export default HomePage;
