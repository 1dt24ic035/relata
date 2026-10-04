"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [showTrending, setShowTrending] = useState(false);

  return (
    <header className="relative z-50 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <nav className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Relata"
              width={44}
              height={44}
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              priority
            />

            <span className="text-xl font-bold text-white sm:text-2xl">
              Relata
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">

            {/* Explore → Login */}
            <Link
              href="/login"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Explore
            </Link>

            {/* Trending */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTrending((value) => !value)}
                className="text-sm text-gray-300 transition hover:text-white"
              >
                Trending
              </button>

              {showTrending && (
                <div className="absolute left-1/2 top-full mt-4 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-2xl shadow-black/40">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white">
                      🔥 Trending Experiences
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Popular experiences people are reading and engaging with.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-purple-500/30 hover:bg-white/10"
                    >
                      <p className="font-semibold text-white">
                        Discover popular experiences
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Log in to explore what's trending on Relata.
                      </p>
                    </Link>

                    <Link
                      href="/login"
                      className="block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-purple-500/30 hover:bg-white/10"
                    >
                      <p className="font-semibold text-white">
                        Most liked experiences
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        See experiences the community is loving.
                      </p>
                    </Link>

                    <Link
                      href="/login"
                      className="block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-purple-500/30 hover:bg-white/10"
                    >
                      <p className="font-semibold text-white">
                        Most saved experiences
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Discover experiences people want to remember.
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Categories → Landing Page Categories */}
            <Link
              href="#categories"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Categories
            </Link>

            {/* About */}
            <Link
              href="#about"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-2 text-xs font-bold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-4 flex items-center justify-between overflow-x-auto border-t border-white/10 pt-3 md:hidden">

          {/* Explore → Login */}
          <Link
            href="/login"
            className="whitespace-nowrap px-2 text-xs text-gray-400 transition hover:text-white"
          >
            Explore
          </Link>

          {/* Trending */}
          <button
            type="button"
            onClick={() => setShowTrending((value) => !value)}
            className="whitespace-nowrap px-2 text-xs text-gray-400 transition hover:text-white"
          >
            Trending
          </button>

          {/* Categories → Landing Page Categories */}
          <Link
            href="#categories"
            className="whitespace-nowrap px-2 text-xs text-gray-400 transition hover:text-white"
          >
            Categories
          </Link>

          {/* About */}
          <Link
            href="#about"
            className="whitespace-nowrap px-2 text-xs text-gray-400 transition hover:text-white"
          >
            About
          </Link>
        </div>

        {/* Mobile Trending Preview */}
        {showTrending && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 md:hidden">
            <h3 className="text-base font-bold text-white">
              🔥 Trending Experiences
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Popular experiences from the Relata community.
            </p>

            <Link
              href="/login"
              className="mt-4 block rounded-xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <p className="font-semibold text-white">
                Explore popular experiences
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Log in to discover what's trending.
              </p>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}