import { useNavigate, useParams } from 'react-router-dom';
import ImagePinDetail from '../components/image/ImagePinDetail';
import { useEffect, useState } from 'react';
import { deleteImagePin, getImageDetails } from '../api/image.api';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import { ImageDetailsInfo } from '../api/types/image.data.type';
import Loading from '../components/common/Loading';
import {
  createSaveImage,
  deleteSaveImage,
  getSaveImage,
} from '../api/saveimage.api';
import { SaveImageInfo } from '../api/types/saveimage.data.type';
import ImagePinList from '../components/image/ImagePinList';

function ImagePinDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const [imageDetails, setImageDetails] = useState<
    Response<ImageDetailsInfo> | ErrorResponse
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveImage, setSaveImage] = useState<SaveImageInfo | null>(null);

  const isErrorResponse = (
    response: Response<ImageDetailsInfo> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  useEffect(() => {
    checkParamValidation();
    getImageDeatilsData();
    getSaveImageData();
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

  const getSaveImageData = () => {
    if (!param.id) return;
    getSaveImage(Number.parseInt(param.id), (res) => {
      if (!res || !res.success) return;
      else if (res.data) {
        setIsSaved(true);
        setSaveImage(res.data);
      }
    });
  };

  const deleteImagePinRequest = (id: number) => {
    setLoading(true);
    deleteImagePin(id.toString(), (res) => {
      if (!res || !res.success) setLoading(false);
      else if (res.success) navigate('/');
    });
  };

  const requesToCreateSaveImage = (id: number) => {
    createSaveImage(id, (res) => {
      if (!res || !res.success) {
        // todo 댓글 삭제 실패 안내문 alert 띄우기.
        return;
      } else if (res.success) {
        setIsSaved(true);
        setSaveImage(res.data);
      }
    });
  };

  const requesToDeleteSaveImage = () => {
    if (!saveImage) {
      // todo save image 취소 실패 안내문 alert 띄우기. 뭔가 알 수 없는 문제가 생겼다고 알림.
      return;
    }
    deleteSaveImage(saveImage.id, (res) => {
      if (!res || !res.success) return;
      else if (res.success && res.data) {
        setIsSaved(false);
        setSaveImage(null);
      }
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
          isSaved={isSaved}
          createSaveImage={requesToCreateSaveImage}
          deleteSaveImage={requesToDeleteSaveImage}
        ></ImagePinDetail>
      )}
      {imageDetails?.data?.imageDetails?.moreImages && imageDetails.data.imageDetails.moreImages.images.length > 0 && (
        <>
          <h3 className='mt-3 mb-1 text-[20px] font-medium'>더 찾아보기</h3>
          <div className="flex flex-wrap justify-center">
            <ImagePinList
              imageDatas={imageDetails.data.imageDetails.moreImages}
            ></ImagePinList>
          </div>
        </>
      )}
    </div>
  );
}
export default ImagePinDetailPage;
