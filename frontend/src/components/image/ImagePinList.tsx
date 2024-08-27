import ImagePin from './ImagePin';
import { ImagePins } from '@/src/api/types/image.data.type';
import EmptyImagePin from './EmptyImagePin';
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  imageDatas: ImagePins;
  fetchData: () => void;
  isLastPage: boolean;
  isFetching: boolean;
}

function ImagePinList({
  imageDatas,
  fetchData,
  isLastPage,
  isFetching,
}: Props) {
  const [images, setImages] = useState<ReactNode[]>([]);
  const imagePinRef = useRef<HTMLDivElement | null>(null);
  const options: IntersectionObserverInit = {
    rootMargin: '0px',
    threshold: 0.5,
  };
  const callback: IntersectionObserverCallback = useCallback((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (isLastPage) {
          observer.unobserve(entry.target);
        }
        if (!isLastPage && !isFetching) fetchData();
      }
    });
  }, [isLastPage, isFetching]);

  useEffect(() => {
    if (!imagePinRef.current) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(imagePinRef.current);

    return () => observer.disconnect();
  }, [imagePinRef, callback]);

  useEffect(() => {
    if (!imageDatas) return;
    const newImages = imageDatas.images?.map((value, index) => {
      if (!value) return <EmptyImagePin key={index} />;

      const { id, url } = value;
      if (!id || !url) return <EmptyImagePin key={index} />;

      return <ImagePin key={id} id={id} url={url}></ImagePin>;
    });

    setImages([...images, ...newImages]);
  }, [imageDatas]);

  return (
    <>
      {images}
      <div ref={imagePinRef}></div>
    </>
  );
}

export default ImagePinList;
