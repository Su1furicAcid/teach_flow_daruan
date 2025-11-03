"use client";
import { useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import HistoryPanel from '@/components/HistoryPanel';
import { useConversationStore } from '@/lib/stores/conversationStore';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHistory = pathname?.startsWith('/dashboard/syllabus') || pathname?.startsWith('/dashboard/chat');
  const navItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </svg>
      ),
      text: "功能分区",
      href: "/home/dashboard/"
    },
    // {
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    //     </svg>
    //   ),
    //   text: "PPT生成",
    //   href: "/dashboard/ppt"
    // },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      text: "一键备课",
      href: "/home/"
    },
    {
      icon: (
        <svg className="w-5 h-5"
          viewBox="0 0 1024 1024"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg" >
          <path d="M128.1664 511.4816c0-53.5424-0.16-107.0848 0.0512-160.6272 0.1536-38.5536 14.7072-70.9184 43.4112-96.6848 5.6-5.024 11.8336-9.4784 18.24-13.4464 84.736-52.4224 169.3184-105.088 254.4384-156.8768 44.6144-27.1424 90.7392-27.2896 135.36-0.192 85.4464 51.8784 170.3552 104.6272 255.2768 157.3504 35.104 21.792 55.0336 53.792 60.3776 94.7648 0.672 5.1648 0.8064 10.4256 0.8128 15.6416 0.0448 106.976 0.288 213.9584-0.0832 320.9344-0.1664 47.8016-20.896 85.2096-61.472 110.4896-84.6592 52.7424-169.4592 105.2672-254.688 157.0752-44.736 27.1936-90.912 27.0976-135.6416-0.1152-84.8512-51.6288-169.1712-104.1152-253.664-156.3136-33.8624-20.9216-54.2336-51.0912-60.8256-90.3552-1.1584-6.8992-1.5104-14.0096-1.5296-21.0176-0.1216-53.5424-0.064-107.0848-0.064-160.6272z m704 0.4544c0-53.3312 0.0256-106.6624-0.0128-159.9872-0.0192-24.96-10.6624-44.1088-31.8976-57.216-84.416-52.1344-168.8192-104.2752-253.3248-156.2496-22.9952-14.144-46.5024-14.1504-69.4976-0.0128-84.512 51.968-168.9152 104.1216-253.3376 156.2432-21.2352 13.1136-31.9104 32.2496-31.9232 57.2032-0.032 106.6624-0.032 213.3184 0.0064 319.9808 0.0064 24.8256 10.6432 43.9232 31.7568 56.9664 84.1344 51.968 168.3136 103.872 252.4928 155.7824 23.7888 14.6688 47.648 14.688 71.4432 0.0128 84.1792-51.904 168.352-103.8144 252.4928-155.776 21.12-13.0432 31.7568-32.128 31.7824-56.9536 0.0576-53.3376 0.0192-106.6624 0.0192-159.9936z" p-id="2570"></path><path d="M544.1664 511.2c0-42.4512-0.032-84.896 0.0192-127.3472 0.0192-18.688 14.9248-32.9728 33.504-32.3008 16.2368 0.5824 29.9264 14.3168 30.4512 30.5536 0.0256 0.7488 0.0256 1.4912 0.0256 2.24 0 84.7936 0.0128 169.5808-0.0064 254.3744-0.0064 18.3616-13.9456 32.7104-31.7504 32.8-17.664 0.0896-32.128-14.016-32.1984-31.6928-0.1088-26.24-0.032-52.4736-0.032-78.7136-0.0128-16.64-0.0128-33.28-0.0128-49.9136zM480.16 511.5136c0 31.9936 0.0576 63.9936-0.0192 95.9872-0.0448 18.0672-14.5344 32.2112-32.5248 32.0064-17.0048-0.1984-31.2-14.176-31.3984-31.1936-0.16-13.7536-0.0448-27.5136-0.0448-41.2736 0-50.4448-0.032-100.896 0.0192-151.3408 0.0192-17.8496 14.1696-32.0832 31.7312-32.1728 17.7984-0.096 32.1792 14.08 32.2176 32 0.0768 32 0.0192 63.9936 0.0192 95.9872zM352.16 511.6672c0 21.2224 0.0512 42.4448-0.0192 63.6672-0.064 18.5088-14.8544 32.7168-33.3248 32.1536-16.3712-0.4928-30.4896-14.3104-30.5664-30.6944-0.192-43.5136-0.1984-87.0272 0-130.5408 0.0768-17.024 14.8736-30.8224 32.1408-30.7392 17.0624 0.0832 31.5328 13.952 31.6992 30.8736 0.2112 21.7536 0.0512 43.5136 0.0512 65.2672 0.0128 0.0128 0.0192 0.0128 0.0192 0.0128zM672.1728 511.36c0-21.2224-0.0576-42.4448 0.0192-63.6672 0.064-18.5024 14.88-32.7232 33.3376-32.1472 16.3776 0.512 30.4832 14.3296 30.5536 30.7072 0.1856 43.5136 0.192 87.0272 0 130.5408-0.0768 17.0176-14.8736 30.8096-32.1536 30.72-17.0624-0.0832-31.52-13.952-31.6864-30.8864-0.2112-21.7536-0.0512-43.5136-0.0512-65.2672h-0.0192z" p-id="2571">
          </path>
        </svg>
      ),
      text: "智能助手",
      href: "/home/chat"
    },
    // {
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    //     </svg>
    //   ),
    //   text: "习题推荐",
    //   href: "/dashboard/exercise"
    // },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M8 14v-4m4 4V8m4 8v-6" />
        </svg>
      ),
      text: "学情分析",
      href: "/home/analysis"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      ),
      text: "个人信息",
      href: "/home/profile"
    }
  ];
  const { conversations } = useConversationStore();
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: 'PPT生成 · 数学课件', timestamp: '2025-03-22T10:00:00' },
    { id: 2, title: '教学大纲 · 物理课程', timestamp: '2025-03-22T14:30:00' },
    { id: 3, title: 'PPT生成 · 英语课件', timestamp: '2025-03-11T09:15:00' },
  ]);
  useEffect(() => {
    const merged = [
      ...historyItems.filter(item => item.id <= 3),
      ...conversations.map(con => ({
        id: con.id,
        title: con.title,
        timestamp: con.timestamp
      }))
    ].sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp)
    );
    setHistoryItems(merged);
  }, [conversations]);

  return (
    <div className={`grid ${showHistory ? 'grid-cols-[auto_auto_1fr]' : 'grid-cols-[auto_1fr]'} h-screen w-full bg-gray-50`}>
      <NavigationMenu items={navItems} />

      {showHistory && <HistoryPanel items={historyItems} />}

      <main className="bg-white overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}