export class GetPaginationDataDto {
  size: number;
  page: number;
  totalPage: number;
  totalCount: number;
  isLastPage: boolean;

  constructor(
    size: number,
    page: number,
    totalPage: number,
    totalCount: number,
    isLastPage: boolean,
  ) {
    this.size = size;
    this.page = page;
    this.totalPage = totalPage;
    this.totalCount = totalCount;
    this.isLastPage = isLastPage;
  }
}
