import { create } from 'zustand';
import { login, register, getUserProfile } from '../api/user';

type User = {
    id: number;
    email: string;
    name: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    fetchUserProfile: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,

    fetchUserProfile: async () => {
        try {
            const response = await getUserProfile();
            const userData = response.data.data;
            set((state) => ({ user: { ...state.user, name: userData.username, email: userData.email } as User }));
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // If fetching profile fails, token might be invalid, so log out
            get().logout();
            set({ error: '会话已过期，请重新登录。' });
        }
    },

    initialize: async () => {
        const storedToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');
        const storedId = localStorage.getItem('user_id');
        if (storedToken && storedId) {
            set({ token: storedToken, refreshToken: storedRefreshToken, user: { id: parseInt(storedId, 10) } as User });
            await get().fetchUserProfile();
        }
    },

    register: async (username, password, email) => {
        set({ isLoading: true, error: null });
        try {
            await register({ username, password, email });
            set({ isLoading: false });
        } catch (error) {
            set({ error: '注册失败: ' + error, isLoading: false });
            throw error;
        }
    },

    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await login({ username, password });
            const data = response.data.data;
            
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);
            localStorage.setItem('user_id', data.id.toString());
            document.cookie = `isAuthenticated=true; path=/; expires=${new Date(Date.now() + 3600 * 1000).toUTCString()}`;
            
            set({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                user: { id: data.id } as User,
            });

            // Fetch user profile after setting the token
            await get().fetchUserProfile();

        } catch (error) {
            set({ error: '登录失败，请检查凭证'+ error, isLoading: false });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        document.cookie = 'isAuthenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, token: null, refreshToken: null, error: null });
    }
}));