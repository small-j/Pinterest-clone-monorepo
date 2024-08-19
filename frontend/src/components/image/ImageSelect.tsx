import { ChangeEvent } from 'react';
import { Input } from '../shadcn/ui/input';
import { FileInfo } from '../../api/types/image.data.type';
import ImageCard from './ImageCard';

interface Props {
  uploadFile: (files: FileList | null) => void;
  imageUploadedData: FileInfo | undefined | null;
}

function ImageSelect({ uploadFile, imageUploadedData }: Props) {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    uploadFile(e.target.files);
  };

  return (
    <div>
      {!imageUploadedData && (
        <>
          <label htmlFor="input-file">
            <div className="w-[375px] h-[574px] flex justify-center items-center  bg-[#e9e9e9] border-2 border-dashed border-gray-300 rounded-3xl">
              <div>파일을 선택하거나 여기로 끌어다 놓으세요.</div>
            </div>
          </label>
          <Input
            className='hidden'
            type="file"
            accept="image/jpg,impge/png,image/jpeg"
            id="input-file"
            onChange={changeHandler}
          />
        </>
      )}
      {imageUploadedData && (
        <ImageCard width={'[375px]'} height={'[574px]'} url={imageUploadedData.fileMetaData.url}/>
      )}
    </div>
  );
}

export default ImageSelect;
