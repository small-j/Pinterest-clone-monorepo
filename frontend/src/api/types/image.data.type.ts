/*
    프론트에서 사용할 형태의 데이터 타입을 지정.
*/

export interface ImagePin {
  id: number;
  url: string;
}

export interface ImagePins {
  images: ImagePin[] | void[];
}

export type MainImage = ImagePins;
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

export interface ImageReplyInfo {
  id: number;
  content: string;
  userId: number;
  userName: string;
}
