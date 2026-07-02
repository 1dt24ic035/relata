"use client";

import Image from "next/image";

type NavbarProps = {
  onJoinClick: () => void;
};

export default function Navbar({ onJoinClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Relata"
              width={42}
              height={42}
            />

            <span className="text-2xl font-bold text-white">
              Relata
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-gray-300">
            <a href="#" className="hover:text-white transition">
              Explore
            </a>

            <a href="#" className="hover:text-white transition">
              Categories
            </a>

            <a href="#" className="hover:text-white transition">
              About
            </a>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">

            <button className="text-gray-300 hover:text-white transition">
              Login
            </button>

            <button
              onClick={onJoinClick}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold hover:scale-105 transition"
            >
              Join Waitlist
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}