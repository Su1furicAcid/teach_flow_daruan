import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-20">
      <div className="mx-auto max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          欢迎登录 TeachFlow
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}