export interface ErrorResponse {
    data: null;
    errorMessage: string;
    success: boolean;
}

export interface Response<T> {
    data: T;
    success: boolean;
}