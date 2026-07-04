"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavbarProps = {
  onJoinClick: () => void;
};

export default function Navbar({ onJoinClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div
          className={`flex items-center justify-between rounded-2xl border px-6 py-4 transition-all duration-300 ${
            scrolled
              ? "border-white/15 bg-black/70 backdrop-blur-2xl shadow-2xl shadow-purple-900/10"
              : "border-white/10 bg-white/5 backdrop-blur-xl"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/logo.png"
              alt="Relata"
              width={42}
              height={42}
            />

            <span className="text-2xl font-bold tracking-tight text-white">
              Relata
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-gray-300">
            <a
              href="#"
              className="transition hover:text-purple-300"
            >
              Explore
            </a>

            <a
              href="#"
              className="transition hover:text-purple-300"
            >
              Categories
            </a>

            <a
              href="#"
              className="transition hover:text-purple-300"
            >
              About
            </a>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 transition hover:text-white">
              Login
            </button>

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