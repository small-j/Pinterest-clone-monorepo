import ImagePin from './ImagePin';
import { ImagePins } from '@/src/api/types/image.data.type';
import EmptyImagePin from './EmptyImagePin';

interface Props {
  imageDatas: ImagePins;
}

function ImagePinList({ imageDatas }: Props) {
  return (
    <>
      {imageDatas.images?.map((value, index) => {
        if (!value) return <EmptyImagePin key={index} />;

        const { id, url } = value;
        if (!id || !url) return <EmptyImagePin key={index} />;

        return <ImagePin key={id} id={id} url={url}></ImagePin>;
      })}
    </>
  );
}

export default ImagePinList;
