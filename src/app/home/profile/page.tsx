'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../../lib/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user, initialize, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        if (!useAuthStore.getState().token) {
          router.push('/login');
        }
      }, 100);
    }
  }, [token, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>正在加载用户信息...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">用户名</span>
              <span className="text-lg">{user.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">邮箱</span>
              <span className="text-lg">{user.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
