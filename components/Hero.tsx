"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-black px-6 pb-16 pt-36 text-white">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />

        <div className="absolute right-20 top-52 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />

        <div className="absolute bottom-10 left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl text-center">

        {/* Relata Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Relata Logo"
            width={110}
            height={110}
            priority
          />
        </div>

        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-purple-700/40 bg-purple-900/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-200 sm:text-sm">
          ✨ Real Experiences • Better Decisions
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-6xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          <span className="block whitespace-nowrap">
            Someone has already lived
          </span>

          <span className="block whitespace-nowrap">
            the life you're trying to figure out.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Discover real stories, honest lessons, and practical advice from
          people who've already been where you're headed.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-lg font-semibold transition duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
          >
            Create Your Account →
          </Link>

          <Link
            href="/login"
            className="rounded-2xl border border-gray-700 px-8 py-4 text-lg font-semibold transition duration-300 hover:bg-white hover:text-black"
          >
            Explore Experiences
          </Link>
        </div>

        {/* Trust Line */}
        <p className="mt-6 text-sm text-gray-500">
          Share your experience • Learn from others • Make better decisions
        </p>
      </div>
    </section>
  );
}