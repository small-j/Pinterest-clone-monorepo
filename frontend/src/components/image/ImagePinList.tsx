import ImagePin from './ImagePin';
import { ImagePins } from '@/src/api/types/image.data.type';
import EmptyImagePin from './EmptyImagePin';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  imageDatas: ImagePins;
  fetchData: () => void;
  isCanFetchData: () => boolean;
}

function ImagePinList({ imageDatas, fetchData, isCanFetchData }: Props) {
  const [isIntersect, setIsIntersect] = useState<boolean>(false);
  const [images, setImages] = useState<ReactNode[]>([]);
  const imagePinRef = useRef<HTMLDivElement | null>(null);

  const callback: IntersectionObserverCallback = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setIsIntersect(true);
    });
  }, []);
  const options: IntersectionObserverInit = {
    rootMargin: '0px',
    threshold: 0.5,
  };

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

  useEffect(() => {
    return () => setImages([]);
  }, []);

  useEffect(() => {
    if (!imagePinRef.current) return;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(imagePinRef.current);
    return () => observer.disconnect();
  }, [callback, imagePinRef]);

  useEffect(() => {
    if (isIntersect && isCanFetchData()) {
      fetchData();
      setIsIntersect(false);
    }
  }, [isIntersect]);

  return (
    <>
      {images}
      <div ref={imagePinRef}></div>
    </>
  );
}

export default ImagePinList;
