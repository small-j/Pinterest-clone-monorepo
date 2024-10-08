import { useNavigate, useParams } from 'react-router-dom';
import ImagePinDetail from '../components/image/ImagePinDetail';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteImagePin,
  getImageDetails,
  getImageWithSimilarCategories,
} from '../api/image.api';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import {
  ImageDetailsInfo,
  SimilarCategoriesImage,
} from '../api/types/image.data.type';
import Loading from '../components/common/Loading';
import {
  createSaveImage,
  deleteSaveImage,
  getSaveImage,
} from '../api/saveimage.api';
import { SaveImageInfo } from '../api/types/saveimage.data.type';
import ImagePinList from '../components/image/ImagePinList';
import { commonValue } from '../common.value';
import { ImageReplyInfo } from '../api/types/reply.data.type';

function ImagePinDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const [imageDetails, setImageDetails] = useState<
    Response<ImageDetailsInfo> | ErrorResponse
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [replies, setReplies] = useState<ImageReplyInfo[]>();
  const [isSaved, setIsSaved] = useState(false);
  const [saveImage, setSaveImage] = useState<SaveImageInfo | null>(null);
  const [imageDatas, setImageDatas] = useState<
    Response<SimilarCategoriesImage> | ErrorResponse
  >();
  const page = useRef<number>(1);
  const [isFetching, setFetching] = useState(false);
  const isLastPage = useMemo<boolean>(() => {
    if (!imageDatas || !imageDatas.data) return true;
    return imageDatas.data.paginationInfo.isLastPage;
  }, [imageDatas]);

  useEffect(() => {
    checkParamValidation();

    window.scrollTo(0, 0);
    page.current = 1;
    initState();

    getImageDeatilsData();
    getSaveImageData();
    getSimilarCategoriesImages();
  }, [param.id]);

  const initState = () => {
    setIsSaved(false);
    setSaveImage(null);
    setImageDatas(undefined);
    setFetching(false);
  };

  const setRepliesHandler = (newReplies: ImageReplyInfo[]) => {
    setReplies(newReplies);
  };

  const checkParamValidation = () => {
    if (!param.id) navigate('/');
    return false;
  };

  const getImageDeatilsData = () => {
    if (!param.id) return;
    getImageDetails(Number.parseInt(param.id), (res) => {
      setImageDetails(res);
      setReplies(res.data?.imageDetails.replies);
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
    deleteImagePin(id, (res) => {
      if (!res || !res.success) setLoading(false);
      else if (res.success) navigate('/');
    });
  };

  const requestToCreateSaveImage = (id: number) => {
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

  const requestToDeleteSaveImage = () => {
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

  const getSimilarCategoriesImages = useCallback(() => {
    if (!param.id) return;
    if (!visualViewport) return;
    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport);
    const callback = (
      res: Response<SimilarCategoriesImage> | ErrorResponse,
    ) => {
      setImageDatas(res);
      page.current = page.current + 1;
      setFetching(false);
    };

    getImageWithSimilarCategories(
      Number.parseInt(param.id),
      { size, page: page.current },
      callback,
    );
    setFetching(true);
  }, [param.id, imageDatas]);

  const isErrorResponse = (
    response: Response<ImageDetailsInfo> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  const isErrorImagesResponse = (
    response: Response<SimilarCategoriesImage> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
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
      {imageDetails && imageDetails.data?.imageDetails && replies && (
        <ImagePinDetail
          {...imageDetails.data.imageDetails}
          replies={replies}
          setReplies={setRepliesHandler}
          deleteImagePinRequest={deleteImagePinRequest}
          isSaved={isSaved}
          createSaveImage={requestToCreateSaveImage}
          deleteSaveImage={requestToDeleteSaveImage}
        ></ImagePinDetail>
      )}
      {!isErrorImagesResponse(imageDatas) &&
        imageDatas &&
        imageDatas.success &&
        imageDatas.data && (
          <>
            <h3 className="mt-3 mb-1 text-[20px] font-medium">더 찾아보기</h3>
            <div className="flex flex-wrap justify-center">
              <ImagePinList
                imageDatas={imageDatas.data.imagePins}
                fetchData={getSimilarCategoriesImages}
                isFetching={isFetching}
                isLastPage={isLastPage}
              ></ImagePinList>
            </div>
          </>
        )}
    </div>
  );
}
export default ImagePinDetailPage;
