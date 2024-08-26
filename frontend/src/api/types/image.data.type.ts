/*
    프론트에서 사용할 형태의 데이터 타입을 지정.
*/

import { PaginationInfo } from "./common.data.type";
import { ImageReplyInfo } from "./reply.data.type";

export interface ImagePin {
  id: number;
  url: string;
}

export interface ImagePins {
  images: ImagePin[] | void[];
}

export interface MainImage {
  imagePins: ImagePins;
  paginationInfo: PaginationInfo;
  seed: number;
}
export type SearchImage = ImagePins;

export interface FileInfo {
  fileMetaData: {
    key: string;
    url: string;
  };
}

export interface CreateImagePinInfo {
  title: string;
  content: string;
  key: string;
  url: string;
  categoryIds: number[];
}

export interface ImageDetailsInfo {
  imageDetails: {
    id: number;
    title: string;
    content: string;
    url: string;
    userId: number;
    userName: string;
    userEmail: string;
    replies: ImageReplyInfo[];
    moreImages: ImagePins;
  };
}
