import axios from 'axios';
import { refreshToken } from './user';
import { parseJwtExp } from '../utils/parse-jwt';

export const instance = axios.create({
    baseURL: '/api',
    timeout: 30000,
});

instance.interceptors.request.use(async (config) => {
    let access_token = localStorage.getItem('access_token');
    if (!access_token) { return config; }

    const exp = parseJwtExp(access_token);
    if (typeof exp === 'undefined' || exp && Date.now() >= exp * 1000) {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) { return config; }
        try {
            const response = await refreshToken({ refreshToken: refresh_token });
            const data = response.data;
            localStorage.setItem('access_token', data.data.accessToken);
            localStorage.setItem('refresh_token', data.data.refreshToken);
            access_token = data.data.accessToken;
        } catch (error) {
            throw error;
        }
    }
    if (config.headers) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
})

export const withoutAuthInstance = axios.create({
    baseURL: '/api',
    timeout: 30000,
});

export interface ResponseBody<T> {
    code: string;
    detail: string;
    msg: string;
    data: T;
}