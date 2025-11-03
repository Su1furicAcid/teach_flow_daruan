import { withoutAuthInstance, ResponseBody, instance } from "./instance"

export const login = (data: { username: string, password: string }) => 
    withoutAuthInstance.post<
        ResponseBody<{
            refreshToken: string;
            accessToken: string;
            id: number;
        }>
    >('/auth/signin', data);

export const refreshToken = (data: { refreshToken: string }) =>
    withoutAuthInstance.post<
        ResponseBody<{
            refreshToken: string;
            accessToken: string;
            id: number;
        }>
    >('/auth/refresh', data);

export const register = (data: { username: string, password: string, email: string }) =>
    withoutAuthInstance.post<
        ResponseBody<{
            id: number;
            username: string;
        }>
    >('/auth/signup', data);

export const getUserProfile = () => 
    instance.get<
        ResponseBody<{
            email: string;
            username: string;
        }>
    >('/user/me');