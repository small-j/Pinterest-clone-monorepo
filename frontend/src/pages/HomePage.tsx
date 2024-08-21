import { useEffect, useState } from 'react';
import { getMainImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { ImagePins } from '../api/types/image.data.type';

function HomePage() {
  const [imageDatas, setImageDatas] = useState<
    Response<ImagePins> | ErrorResponse
  >();

  useEffect(() => {
    getMainImages((res) => {
      setImageDatas(res);
    });
  }, []);

  const isErrorResponse = (
    response: Response<ImagePins> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      {!imageDatas && <div>loading...</div>}
      {isErrorResponse(imageDatas) && <div>{imageDatas.errorMessage}</div>}
      {imageDatas && imageDatas.success && imageDatas.data && (
        <ImagePinList imageDatas={imageDatas.data}></ImagePinList>
      )}
    </div>
  );
}
export default HomePage;
