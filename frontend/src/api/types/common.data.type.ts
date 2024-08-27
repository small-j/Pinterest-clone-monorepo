export interface ErrorResponse {
  data: null;
  errorMessage: string;
  success: boolean;
}

export interface Response<T> {
  data: T;
  success: boolean;
}

export type ResponseCallback<T> = (data: Response<T> | ErrorResponse) => void;

export interface PaginationParams {
  size: number;
  page: number;
}

export interface PaginationInfo {
  size: number;
  page: number;
  totalPage: number;
  totalCount: number;
  isLastPage: boolean;
}
