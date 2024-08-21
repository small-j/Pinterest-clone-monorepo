import { useNavigate, useParams } from 'react-router-dom';
import { getSearchImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { ImagePins, SearchImage } from '../api/types/image.data.type';
import { ErrorResponse, Response, ResponseCallback } from '../api/types/common.data.type';
import { useEffect, useState } from 'react';

function SearchPage() {
  const param = useParams();
  const [imageDatas, setImageDatas] = useState<
    Response<ImagePins> | ErrorResponse
  >();

  useEffect(() => {
    requestSearchImages(param.searchWord || '');
  }, []);
  useEffect(() => {
    requestSearchImages(param.searchWord || '');
  }, [param.searchWord]);

  const requestSearchImages = (searchWord: string) => {
    if (!searchWord || searchWord === '') useNavigate()('/');
    const callback: ResponseCallback<SearchImage> = (res) => {
      setImageDatas(res);
    }

    getSearchImages(searchWord, callback);
  };

  const isErrorResponse = (
    response: Response<ImagePins> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  return (
    <div className="w-full flex flex-wrap justify-center">
      {!imageDatas && <div>loading...</div>}
      {isErrorResponse(imageDatas) && <div>{imageDatas.errorMessage}</div>}
      {imageDatas?.success && imageDatas.data && (
      <ImagePinList imageDatas={imageDatas.data}></ImagePinList>
      )}
    </div>
  );
}
export default SearchPage;
