"use client";

import Link from "next/link";

type WaitlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WaitlistModal({
  isOpen,
  onClose,
}: WaitlistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-8 text-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Welcome to Relata
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Join the community
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl text-gray-500 transition hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="mt-6 leading-7 text-gray-400">
          Discover real experiences, learn from other people's journeys,
          and share your own experiences to help others make better
          decisions.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link
            href="/login"
            onClick={onClose}
            className="block w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 text-center font-semibold transition hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20"
          >
            Create Account →
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="block w-full rounded-xl border border-white/10 bg-zinc-900 px-6 py-4 text-center font-semibold text-gray-300 transition hover:bg-white hover:text-black"
          >
            I already have an account
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Real experiences. Better decisions.
        </p>
      </div>
    </div>
  );
}