"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type NavbarProps = {
  onJoinClick: () => void;
};

export default function Navbar({
  onJoinClick,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div
          className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition-all duration-300 ${
            scrolled
              ? "border-white/15 bg-black/70 shadow-2xl shadow-purple-900/10 backdrop-blur-2xl"
              : "border-white/10 bg-white/5 backdrop-blur-xl"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Relata"
              width={42}
              height={42}
            />

            <span className="text-2xl font-bold tracking-tight text-white">
              Relata
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 text-gray-300 md:flex">
            <Link
              href="/search"
              className="transition hover:text-purple-300"
            >
              Explore
            </Link>

            <a
              href="/#categories"
              className="transition hover:text-purple-300"
            >
              Categories
            </a>

            <a
              href="/#about"
              className="transition hover:text-purple-300"
            >
              About
            </a>
          </nav>

          {/* Right Side */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="text-gray-300 transition hover:text-white"
            >
              Login
            </Link>

            <button
              onClick={onJoinClick}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold transition duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              Join Early Access
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}