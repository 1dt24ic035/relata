"use client";

"use client";

import { useMemo, useState } from "react";
import {
  validateEmail,
  validateExperience,
  validateName,
} from "../lib/validation";

type WaitlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WaitlistModal({
  isOpen,
  onClose,
}: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const nameValid = useMemo(() => validateName(name), [name]);
  const emailValid = useMemo(() => validateEmail(email), [email]);
  const experienceValid = useMemo(
  () => validateExperience(experience),
  [experience]
  );

  const formValid = nameValid && emailValid && experienceValid;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-3xl border border-gray-800 bg-zinc-900 p-8 text-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            🚀 Join Relata
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>

        <p className="text-gray-400 mb-8">
          Become one of the first people building the world's largest library
          of real experiences.
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 outline-none focus:border-purple-500"
          />
          {!nameValid && name.length > 0 && (
         <p className="mt-2 text-sm text-red-400">
         Please enter at least 2 characters.
         </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 outline-none focus:border-purple-500"
          />
          {!emailValid && email.length > 0 && (
         <p className="mt-2 text-sm text-red-400">
          Please enter a valid email address.
         </p>
      )}
        </div>

        {/* Experience */}
        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium">
            What's one experience you wish someone had shared with you earlier?
          </label>

          <textarea
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Share your experience..."
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 outline-none resize-none focus:border-purple-500"
          />
          {!experienceValid && experience.length > 0 && (
  <p className="mt-2 text-sm text-red-400">
    Please write at least 10 characters.
  </p>
)}
        </div>

        {/* Temporary Preview */}
        <div className="mb-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-sm">
          <p><strong>Name:</strong> {name || "-"}</p>
          <p><strong>Email:</strong> {email || "-"}</p>
          <p><strong>Experience:</strong> {experience || "-"}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">

          <button
         disabled={!formValid}
         className={`w-full rounded-xl py-4 font-semibold transition ${
         formValid
         ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02]"
         : "bg-gray-700 text-gray-400 cursor-not-allowed"
         }`}
         >
  Reserve My Spot 🚀
</button>

        </div>

      </div>
    </div>
  );
}