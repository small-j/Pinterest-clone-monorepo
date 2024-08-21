export class GetSaveImageDto {
  id: number;
  userId: number;
  imageMetaId: number;

  constructor(id: number, userId: number, imageMetaId: number) {
    this.id = id;
    this.userId = userId;
    this.imageMetaId = imageMetaId;
  }
}
