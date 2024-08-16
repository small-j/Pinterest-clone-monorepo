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

  const requestSearchImages = (searchWord: string) => {
    if (!searchWord || searchWord === '') useNavigate()('/');
    const callback: ResponseCallback<SearchImage> = (res) => {
      setImageDatas(res);
    }

    getSearchImages(searchWord, callback);
  };

  useEffect(() => {
    requestSearchImages(param.searchWord || '');
  }, []);
  useEffect(() => {
    requestSearchImages(param.searchWord || '');
  }, [param.searchWord]);

  return (
    <div>
      <ImagePinList imageDatas={imageDatas}></ImagePinList>
    </div>
  );
}
export default SearchPage;
