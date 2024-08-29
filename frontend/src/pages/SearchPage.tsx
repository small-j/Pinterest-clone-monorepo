import { useNavigate, useParams } from 'react-router-dom';
import { getSearchImages, searchImageDataAdaptor } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { SearchImage } from '../api/types/image.data.type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { commonValue } from '../common.value';
import { useQuery } from '@tanstack/react-query';
import { validateSearchImageInfo } from '../validator/image.validator';

function SearchPage() {
  const param = useParams();
  const [imageDatas, setImageDatas] = useState<SearchImage>();
  const page = useRef<number>(1);
  const [isFetching, setFetching] = useState(false);
  const isLastPage = useMemo<boolean>(() => {
    if (!imageDatas) return true;
    return imageDatas.paginationInfo.isLastPage;
  }, [imageDatas]);

  useEffect(() => {
    setImageDatas(undefined); // 초기화. 추후 ImagePinList 마운트 되도록.
    page.current = 1;
  }, [param.searchWord]);

  const fetchData = () => {
    setFetching(true);
    page.current = page.current + 1;
  };

  const requestSearchImages = useCallback(() => {
    const searchWord = param.searchWord;
    if (!searchWord || searchWord === '') {
      useNavigate()('/');
      return;
    }
    if (!visualViewport) return;
    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport);

    return getSearchImages({ size, page: page.current }, searchWord);
  }, [param.searchWord, page.current]);

  const { isPending, isError, error, data, isSuccess} = useQuery({
    queryKey: ['searchImages', param.searchWord, page.current],
    queryFn: () => requestSearchImages(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isPending) {
      setFetching(false);
  
      // data가 없는 경우는 이전 화면을 유지한다.
      if (isSuccess && data) setImageDatas(searchImageDataAdaptor(data));
    }
  }, [data]);

  const validateImagePins = useCallback((data: SearchImage): boolean => {
    validateSearchImageInfo(data);
    return data && data.imagePins ? true : false;
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-center">
      {isPending ? <div>loading...</div> : null}
      {isError ? <div>{error.message}</div> : null}
      {(imageDatas && validateImagePins(imageDatas)) ? (
        <ImagePinList
          imageDatas={imageDatas.imagePins}
          fetchData={fetchData}
          isFetching={isFetching}
          isLastPage={isLastPage}
        ></ImagePinList>
      ) : <div>검색 결과가 없습니다.</div>
      }
    </div>
  );
}
export default SearchPage;
