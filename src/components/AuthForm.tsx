"use client";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useState } from 'react';

type FormValues = {
    username: string;
    password: string;
    email?: string;
};

export function AuthForm() {
    const { register, handleSubmit } = useForm<FormValues>();
    const router = useRouter();
    const { login, register: registerUser } = useAuthStore();
    const [isRegistering, setIsRegistering] = useState(false);

    const onSubmit = async (data: FormValues) => {
        console.log('Form data:', data);
        try {
            if (isRegistering) {
                if (!data.email) {
                    alert('请输入邮箱');
                    return;
                }
                await registerUser(data.username, data.password, data.email);
                alert('注册成功! 请登录。');
                setIsRegistering(false);
            } else {
                await login(data.username, data.password);
                router.push('/home');
            }
        } catch (error) {
            console.error(`${isRegistering ? 'Registration' : 'Login'} failed:`, error);
            alert(`${isRegistering ? '注册' : '登录'}失败`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="username">用户名</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="请输入用户名"
                        {...register('username', { required: true })}
                    />
                </div>
                {isRegistering && (
                    <div>
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="请输入邮箱"
                            {...register('email')}
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="password">密码</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="请输入密码"
                        {...register('password', { required: true })}
                    />
                </div>
            </div>
            <button type="submit" className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                {isRegistering ? '注册' : '登录'}
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    {isRegistering ? '已有账户? 前往登录' : '没有账户? 前往注册'}
                </button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">或使用第三方登录</span>
                </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
            <button type="button" className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 ">
                <svg className="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
                Sign in with Apple
            </button>
            <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 ">
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                </svg>
                Sign in with Github
            </button>
            </div>
        </form>
    );
}