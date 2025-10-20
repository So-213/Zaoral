import Link from "next/link";
import { useSession } from "next-auth/react";

interface NavigationMenuProps {
  isOpen: boolean;
  onLinkClick: (href: string) => void;
}

/**
 * ナビゲーションメニューコンポーネント
 */
export default function NavigationMenu({ isOpen, onLinkClick }: NavigationMenuProps) {
  const { data: session, status } = useSession();

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/zaoral", label: "Zaoralとは" },
    { href: "/howToUse", label: "使い方" },
  ];

  const authenticatedMenuItems = [
    { href: "/account", label: "アカウント情報" },
    { href: "/dashboard", label: "ダッシュボード" },
  ];

  return (
    <ul className={`list-none p-0 ${isOpen ? "flex flex-col absolute top-10 left-0 bg-white border border-rose-300 p-2.5 rounded shadow-lg min-w-[180px] text-left z-[1001]" : "hidden"}`}>
      {menuItems.map((item) => (
        <li key={item.href} className="mb-2">
          <Link 
            href={item.href} 
            onClick={() => onLinkClick(item.href)}
            className="block w-full p-3 bg-pink-50 rounded-md text-rose-600 font-bold text-center border border-rose-300 transition-colors hover:bg-pink-200 active:scale-95"
          >
            {item.label}
          </Link>
        </li>
      ))}
      
      {status === "authenticated" && session?.user && 
        authenticatedMenuItems.map((item) => (
          <li key={item.href} className="mb-2">
            <Link 
              href={item.href} 
              onClick={() => onLinkClick(item.href)}
              className="block w-full p-3 bg-pink-50 rounded-md text-rose-600 font-bold text-center border border-rose-300 transition-colors hover:bg-pink-200 active:scale-95"
            >
              {item.label}
            </Link>
          </li>
        ))
      }
    </ul>
  );
}
