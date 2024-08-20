import { useNavigate, useParams } from 'react-router-dom';
import ImagePinDetail from '../components/image/ImagePinDetail';
import { useEffect, useState } from 'react';
import { getImageDetails } from '../api/image.api';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { ImageDetailsInfo } from '../api/types/image.data.type';

function ImagePinDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const [imageDetails, setImageDetails] = useState<Response<ImageDetailsInfo> | ErrorResponse>();

  const isErrorResponse = (
    response: Response<ImageDetailsInfo> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };
  
  useEffect(() => {
    checkParamValidation();
    getImageDeatilsData();
  }, [param.id]);
  
  const checkParamValidation = () => {
    if (!param.id) navigate('/');
    return false;
  }

  const getImageDeatilsData = () => {
    if (!param.id) return;
    getImageDetails(param.id, (res) => {
      setImageDetails(res);
    });
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {!imageDetails && <div>loading...</div>}
      {isErrorResponse(imageDetails) && <div>{imageDetails.errorMessage}</div>}
      {imageDetails &&
        imageDetails.data?.imageDetails &&
      <ImagePinDetail {...imageDetails.data.imageDetails}></ImagePinDetail>}
    </div>
  );
}
export default ImagePinDetailPage;
