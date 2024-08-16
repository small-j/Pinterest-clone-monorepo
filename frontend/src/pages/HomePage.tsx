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
    })
  }, []);

  return (
    <div>
      <ImagePinList imageDatas={imageDatas}></ImagePinList>
    </div>
  );
}
export default HomePage;
