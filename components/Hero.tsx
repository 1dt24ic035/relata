"use client";

import Image from "next/image";

type HeroProps = {
  onJoinClick: () => void;
};

export default function Hero({ onJoinClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center bg-black text-white px-6 pt-36 pb-16">
      {/* Aurora Background */}

<div className="absolute inset-0 overflow-hidden">

  <div className="absolute left-1/2 top-20 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />

  <div className="absolute right-20 top-52 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />

  <div className="absolute left-20 bottom-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />

</div>
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Relata Logo"
            width={110}
            height={110}
            priority
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-purple-700/40 bg-purple-900/20 px-6 py-2 text-purple-200 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-8">
          ✨ Real Experiences • Better Decisions
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-5xl text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          Someone has already lived
          <br />
          the life you're trying to figure out.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
          Discover real stories, honest lessons, and practical advice from
          people who've already been where you're headed.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          <button
            onClick={onJoinClick}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-lg font-semibold transition duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
          >
            Join Early Access →
          </button>

          <button
            className="rounded-2xl border border-gray-700 px-8 py-4 text-lg font-semibold transition duration-300 hover:bg-white hover:text-black"
          >
            Explore Experiences
          </button>

        </div>

        {/* Trust Line */}
        <p className="mt-6 text-sm text-gray-500">
          🚀 Launching soon • Free during beta • Built with real experiences
        </p>

      </div>
    </section>
  );
}