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
    label: "Notifications",
    href: "/notifications",
    icon: "🔔",
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
      {/* Desktop Navigation */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">

          {/* Logo */}

          <Link
            href="/feed"
            className="text-xl font-bold tracking-tight text-white transition hover:text-purple-300"
          >
            Relata
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-purple-600/15 text-purple-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-base">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile profile shortcut */}

          <Link
            href="/profile"
            className={`rounded-full border px-3 py-2 text-sm transition md:hidden ${
              pathname === "/profile"
                ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                : "border-white/10 bg-zinc-900 text-gray-300 hover:border-purple-500/40 hover:text-white"
            }`}
            aria-label="Profile"
          >
            👤
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between py-2">

          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] transition ${
                  active
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-lg leading-none">
                  {item.icon}
                </span>

                <span className="truncate">
                  {item.label ===
                  "Notifications"
                    ? "Alerts"
                    : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}