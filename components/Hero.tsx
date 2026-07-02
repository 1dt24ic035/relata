"use client";

import Image from "next/image";

type HeroProps = {
  onJoinClick: () => void;
};

export default function Hero({ onJoinClick }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white px-6 pt-40 pb-20">
      <div className="w-full max-w-7xl mx-auto text-center">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Relata Logo"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-purple-700/40 bg-purple-900/20 px-8 py-3 text-purple-200 text-sm font-semibold tracking-[0.3em] uppercase mb-10">
          ✨ REAL EXPERIENCES • BETTER DECISIONS
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-6xl text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
          Someone has already lived
          <br />
          the decision you're about to make.
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
          Learn from authentic experiences shared by people who have already
          walked the path before you.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">

          <button
            onClick={onJoinClick}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-4 text-lg font-semibold hover:scale-105 transition"
          >
            Join Waitlist
          </button>

          <button className="rounded-2xl border border-gray-700 px-10 py-4 text-lg font-semibold hover:bg-white hover:text-black transition">
            Share Your Story
          </button>

        </div>

      </div>
    </section>
  );
}