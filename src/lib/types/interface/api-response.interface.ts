interface ApiResponse<T> {
    message: string;
    data: T;
    error?: string;
}

export default ApiResponse;