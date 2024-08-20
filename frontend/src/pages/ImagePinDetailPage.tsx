import { useNavigate, useParams } from 'react-router-dom';
import ImagePinDetail from '../components/image/ImagePinDetail';
import { useEffect, useState } from 'react';
import { deleteImagePin, getImageDetails } from '../api/image.api';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { ImageDetailsInfo } from '../api/types/image.data.type';
import Loading from '../components/common/Loading';

function ImagePinDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const [imageDetails, setImageDetails] = useState<
    Response<ImageDetailsInfo> | ErrorResponse
  >();
  const [loading, setLoading] = useState<boolean>(false);

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
  };

  const getImageDeatilsData = () => {
    if (!param.id) return;
    getImageDetails(param.id, (res) => {
      setImageDetails(res);
    });
  };

  const deleteImagePinRequest = (id: number) => {
    setLoading(true);
    deleteImagePin(id.toString(), (res) => {
      if (!res || !res.success) setLoading(false);
      else if (res.success) navigate('/');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      {loading && (
        <Loading>
          <div>loading...</div>
        </Loading>
      )}
      {!imageDetails && <div>loading...</div>}
      {isErrorResponse(imageDetails) && <div>{imageDetails.errorMessage}</div>}
      {imageDetails && imageDetails.data?.imageDetails && (
        <ImagePinDetail
          {...imageDetails.data.imageDetails}
          deleteImagePinRequest={deleteImagePinRequest}
        ></ImagePinDetail>
      )}
    </div>
  );
}
export default ImagePinDetailPage;
