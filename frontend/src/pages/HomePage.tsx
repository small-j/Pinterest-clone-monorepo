import { useCallback, useMemo, useRef, useState } from 'react';
import { getMainImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { MainImage } from '../api/types/image.data.type';
import { commonValue } from '../common.value';
import { useLoaderData } from 'react-router-dom';

function HomePage() {
  const [imageDatas, setImageDatas] = useState<
    Response<MainImage> | ErrorResponse
  >(useLoaderData() as  Response<MainImage> | ErrorResponse);
  const page = useRef<number>(2);
  const [isFetching, setFetching] = useState(false);
  const isLastPage = useMemo<boolean>(() => {
    if (!imageDatas || !imageDatas.data) return true;
    return imageDatas.data.paginationInfo.isLastPage;
  }, [imageDatas]);

  const fetchData = useCallback(() => {
    if (!visualViewport) return;
    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport); 
    const seed = imageDatas?.data?.seed;
    const callback = (res: Response<MainImage> | ErrorResponse) => {
      setImageDatas(res);
      page.current = page.current + 1;
      setFetching(false);
    };
    
    setFetching(true);

    if (seed) getMainImages({ size, page: page.current }, seed).then(res => callback(res));
    else getMainImages({ size, page: page.current }).then(res => callback(res));

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
