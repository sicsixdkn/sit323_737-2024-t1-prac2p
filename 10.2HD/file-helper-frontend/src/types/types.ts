export interface IUser {
    email: string;
}

declare global {
    interface Window {
        appConfig: {
            USER_SERVICE_API_URI: string;
            PDF_SERVICE_API_URI: string;
            PDF_SERVICE_SOCKET_IO_URI: string;
            PDF_SERVICE_SOCKET_IO_PATH: string;
        };
    }
}