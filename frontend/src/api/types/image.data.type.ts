/*
    프론트에서 사용할 형태의 데이터 타입을 지정.
*/

export interface ImagePins {
    images: { id: number, url: string }[] | void[];
}

export type MainImage = ImagePins;