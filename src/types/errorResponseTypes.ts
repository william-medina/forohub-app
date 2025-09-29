export type ApiErrorResponse = {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    errors?: Record<string, string>;
    path: string;
}