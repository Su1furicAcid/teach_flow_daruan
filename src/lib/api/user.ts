import { withoutAuthInstance, ResponseBody } from "./instance"

export const login = (data: { username: string, password: string }) => 
    withoutAuthInstance.post<
        ResponseBody<{
            refresh: string;
            access: string;
            id: number;
        }>
    >('/auth/signin', data);

export const refreshToken = (data: { refreshToken: string }) =>
    withoutAuthInstance.post<
        ResponseBody<{
            refresh: string;
            access: string;
            id: number;
        }>
    >('/auth/refresh', data);