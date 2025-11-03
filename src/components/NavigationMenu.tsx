"use client";
import Link from 'next/link';
import Image from "next/image";
interface NavItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

export default function NavigationMenu({ items }: { items: NavItem[] }) {
  return (
    <aside className="w-25 border-r border-gray-200 px-2 pt-4 bg-white flex flex-col min-h-screen">
      <div className="mx-2 px-2">
        <Image
          src="/logo.svg"
          alt="TeachFlow Logo"
          width={40}
          height={40}
          className="rounded-lg m-2 "
        />
      </div>
      <nav className="space-y-2 flex-1">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center gap-1 mt-6 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
          >
            {item.icon}
            <span className="text-xs text-center">{item.text}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t pt-2">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs text-center">主页</span>
        </Link>
      </div>
    </aside>
  );
}