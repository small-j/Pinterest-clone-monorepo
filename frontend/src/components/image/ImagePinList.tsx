import ImagePin from './ImagePin';
import { ErrorResponse, Response } from '@/src/api/types/common.data.type';
import { ImagePins } from '@/src/api/types/image.data.type';
import EmptyImagePin from './EmptyImagePin';

interface Props {
  imageDatas: ErrorResponse | Response<ImagePins> | undefined;
}

function ImagePinList({ imageDatas }: Props) {
  const isErrorResponse = (
    response: Response<ImagePins> | ErrorResponse | undefined,
  ): response is ErrorResponse => {
    return !!response && response.success === false;
  };

  return (
    <div className="flex flex-wrap justify-center">
      {!imageDatas && <div>loading...</div>}
      {isErrorResponse(imageDatas) && <div>{imageDatas.errorMessage}</div>}
      {imageDatas &&
        imageDatas.success &&
        imageDatas?.data?.images?.map((value, index) => {
          if (!value) return <EmptyImagePin key={index} />;

          const { id, url } = value;
          if (!id || !url) return <EmptyImagePin key={index} />;

          return <ImagePin key={id} id={id} url={url}></ImagePin>;
        })}
    </div>
  );
}

export default ImagePinList;
