"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Home",
    href: "/feed",
    icon: "🏠",
  },
  {
    label: "Trending",
    href: "/trending",
    icon: "🔥",
  },
  {
    label: "Explore",
    href: "/search",
    icon: "🔎",
  },
  {
    label: "Saved",
    href: "/saved",
    icon: "🔖",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: "👤",
  },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link
            href="/feed"
            className="text-xl font-bold tracking-tight text-white"
          >
            Relata
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-purple-600/15 text-purple-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/profile"
            className="rounded-full border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-gray-300 transition hover:border-purple-500/40 hover:text-white md:hidden"
          >
            👤
          </Link>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {navigation.map((item) => {
            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs transition ${
                  active
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}