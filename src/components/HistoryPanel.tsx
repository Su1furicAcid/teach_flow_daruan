"use client";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { useState, useEffect } from 'react';

interface HistoryItem {
  id: number;
  title: string;
  timestamp: string;
}

export default function HistoryPanel({ items }: { items: HistoryItem[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('historyCollapsed');
    setIsCollapsed(savedState === 'true');
  }, []);

  // 添加分组逻辑
  const groupedItems = items.reduce((acc:Record<string, HistoryItem[]>, item) => {
    const date = dayjs(item.timestamp).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // 添加日期分组标题函数
  const getGroupTitle = (date: string) => {
    const today = dayjs().format('YYYY-MM-DD');
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    switch (date) {
      case today: return '今天';
      case yesterday: return '昨天';
      default: return dayjs(date).format('YYYY年M月D日');
    }
  };

  return (
    <section className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 bg-white p-4 flex flex-col transition-all duration-300`}>
      {/* <div className="flex justify-between items-center mb-4">
        {!isCollapsed && <h3 className="text-sm font-semibold text-gray-500">最近记录</h3>}
      </div> */}

      <div className="space-y-4">
        {Object.entries(groupedItems).map(([date, groupItems]) => (
          <div key={date}>
            <h4 className="text-xs font-medium text-gray-400 mb-2">
              {getGroupTitle(date)}
            </h4>
            <div className="space-y-3">
              {(groupItems as HistoryItem[]).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="text-sm text-gray-600">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {dayjs(item.timestamp).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section >
  );
}