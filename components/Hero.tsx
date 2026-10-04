import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] w-full max-w-7xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6 md:py-24">

        {/* Logo */}
        <div className="mb-8 sm:mb-10">
          <Image
            src="/logo.png"
            alt="Relata"
            width={110}
            height={110}
            className="h-auto w-20 sm:w-24 md:w-28"
            priority
          />
        </div>

        {/* Badge */}
        <div className="mb-8 max-w-full rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 sm:mb-10 sm:px-6">
          <span className="text-[10px] font-semibold tracking-[0.15em] text-purple-200 sm:text-xs sm:tracking-[0.3em]">
            ✨ REAL EXPERIENCES • BETTER DECISIONS
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-[2.1rem] font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">
            Someone has already lived
          </span>

          <span className="block">
            your next chapter.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-7 w-full max-w-3xl text-base leading-7 text-gray-400 sm:mt-8 sm:px-2 sm:text-lg sm:leading-8">
          Discover real stories, honest lessons, and practical advice from
          people who've already been where you're headed.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex w-full max-w-xl flex-col gap-4 sm:mt-10 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 sm:w-auto"
          >
            Create Your Account →
          </Link>

          <Link
            href="/login"
            className="w-full rounded-2xl border border-white/20 bg-white/[0.02] px-8 py-4 text-base font-bold transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 sm:w-auto"
          >
            Explore Experiences
          </Link>
        </div>

        {/* Bottom message */}
        <p className="mt-7 text-xs text-gray-500 sm:text-sm">
          Share your experience • Learn from others • Make better decisions
        </p>
      </div>
    </section>
  );
}