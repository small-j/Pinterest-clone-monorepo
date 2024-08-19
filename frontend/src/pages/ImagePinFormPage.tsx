import { useRef, useState } from 'react';
import { createImagePin, uploadImage } from '../api/image.api';
import ImagePinForm, {
  ExportedMethods,
} from '../components/image/ImagePinForm';
import ImageSelect from '../components/image/ImageSelect';
import { ErrorResponse, Response } from '../api/types/common.data.type';
import {
  FileInfo,
  CreateImagePinInfo,
  ImagePin,
} from '../api/types/image.data.type';
import { Button } from '../components/shadcn/ui/button';
import { useNavigate } from 'react-router-dom';

function ImagePinFormPage() {
  const [uploadedInfo, setUploadedInfo] = useState<
    Response<FileInfo> | ErrorResponse
  >();
  const formRef = useRef<ExportedMethods>(null);
  const navigate = useNavigate();

  const uploadFile = (files: FileList | null) => {
    if (!files) return;
    uploadImage(files[0], (res) => {
      setUploadedInfo(res);
    });
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const requestCreateImageMeta = (data: CreateImagePinInfo) => {
    createImagePin(data, (res: Response<ImagePin> | ErrorResponse) => {
      if (res.success) navigate(`/image-pin-detail/${(res.data as ImagePin).id}`);
    });
  };

  return (
    <div>
      <div className="h-[81px] w-full border-b border-b-[#cdcdcd] flex items-center justify-between bg-white">
        <h1 className="text-2xl m-3">핀 만들기</h1>
        <Button
          className="min-w-15 min-h-12 text-base bg-[#e60023] m-3 rounded-3xl"
          onClick={handleSubmit}
        >
          게시
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="m-6">
          <ImageSelect
            uploadFile={uploadFile}
            imageUploadedData={uploadedInfo?.data}
          ></ImageSelect>
        </div>
        <div className="relative w-[564px] m-6">
          {(!uploadedInfo || !uploadedInfo.success) && (
            <div className="absolute h-full w-full left-0 top-0 bg-white/80"></div>
          )}
          <ImagePinForm
            ref={formRef}
            imageUploadedData={uploadedInfo?.data}
            requestCreateImageMeta={requestCreateImageMeta}
          ></ImagePinForm>
        </div>
      </div>
    </div>
  );
}
export default ImagePinFormPage;
