"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  title: string;
  category: string;
  decision: string;
  story: string;
  lesson: string;
  advice: string;
  created_at: string;
};

export default function ExperienceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperience();
  }, []);

  async function loadExperience() {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      router.push("/dashboard");
      return;
    }

    setExperience(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  if (!experience) return null;

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}

      <header className="border-b border-gray-800">

        <div className="max-w-5xl mx-auto px-6 py-8">

          <button
            onClick={() => router.back()}
            className="text-purple-400 hover:text-purple-300 mb-6"
          >
            ← Back
          </button>

          <span className="inline-block rounded-full bg-purple-600/20 px-4 py-2 text-purple-300 text-sm">
            {experience.category}
          </span>

          <h1 className="text-5xl font-bold mt-5">
            {experience.title}
          </h1>

          <p className="text-gray-500 mt-4">
            {new Date(experience.created_at).toLocaleDateString()}
          </p>

        </div>

      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="text-2xl font-bold mb-4">
            🤔 Decision
          </h2>

          <p className="text-gray-300 leading-8">
            {experience.decision}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="text-2xl font-bold mb-4">
            📖 Full Story
          </h2>

          <p className="text-gray-300 leading-8 whitespace-pre-wrap">
            {experience.story}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="text-2xl font-bold mb-4">
            💡 Biggest Lesson
          </h2>

          <p className="text-gray-300 leading-8">
            {experience.lesson}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="text-2xl font-bold mb-4">
            🎯 Advice for Others
          </h2>

          <p className="text-gray-300 leading-8">
            {experience.advice}
          </p>

        </div>

        <div className="flex gap-4">

          <button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold hover:scale-105 transition">
            ❤️ Like
          </button>

          <button className="rounded-xl border border-gray-700 px-6 py-3 hover:bg-zinc-800 transition">
            🔖 Bookmark
          </button>

        </div>

      </section>

    </main>
  );
}