import { create } from 'zustand';
import { login, register } from '../api/user';

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
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
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
    register: async (username, password, email) => {
        set({ isLoading: true, error: null });
        try {
            await register({ username, password, email });
            // Optionally log the user in directly after registration
            // For now, just signal success
            set({ isLoading: false });
        } catch (error) {
            set({ error: '注册失败: ' + error, isLoading: false });
            throw error;
        }
    },
    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            console.log('login', username, password)
            const response = await login({ username, password });
            const data = response.data;
            console.log('login response', data);
            localStorage.setItem('access_token', data.data.accessToken);
            localStorage.setItem('refresh_token', data.data.refreshToken);
            document.cookie = `isAuthenticated=true; path=/; expires=${new Date(Date.now() + 3600 * 1000).toUTCString()}`;
            set({
                token: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                isLoading: false,
            });
        } catch (error) {
            set({ error: '登录失败，请检查凭证'+ error, isLoading: false });
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'isAuthenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, token: null, refreshToken: null});
    }
}));