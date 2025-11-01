import { create } from 'zustand';
import { login } from '../api/user';

type AuthState = {
    user: null | {
        id: string;
        email: string;
        name: string;
        role: 'user' | 'admin';
    };
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    initializeFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    initializeFromStorage: () => {
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        if (storedUser && storedToken) {
            set({ user: JSON.parse(storedUser), token: storedToken });
        }
    },
    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            console.log('login', username, password)
            const response = await login({ username, password });
            const data = response.data;
            localStorage.setItem('access_token', data.data.access);
            localStorage.setItem('refresh_token', data.data.refresh);
            document.cookie = `isAuthenticated=true; path=/; expires=${new Date(Date.now() + 3600 * 1000).toUTCString()}`;
            set({
                token: data.data.access,
                refreshToken: data.data.refresh,
                isLoading: false,
            });
        } catch (error) {
            set({ error: '登录失败，请检查凭证'+ error, isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'isAuthenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, token: null, refreshToken: null});
    }
}));