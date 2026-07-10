"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  user_id: string;
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

  const [experience, setExperience] =
    useState<Experience | null>(null);

  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadExperience();
  }, []);

  async function loadExperience() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    if (user) {
      setIsOwner(user.id === data.user_id);
    }

    setLoading(false);
  }

  async function deleteExperience() {
    const confirmed = confirm(
      "Delete this experience permanently?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Experience deleted.");

    router.push("/profile");
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

      <header className="border-b border-gray-800">

        <div className="max-w-5xl mx-auto px-6 py-8">

          <button
            onClick={() => router.back()}
            className="mb-6 text-purple-400 hover:text-purple-300"
          >
            ← Back
          </button>

          <span className="inline-block rounded-full bg-purple-600/20 px-4 py-2 text-sm text-purple-300">
            {experience.category}
          </span>

          <h1 className="mt-5 text-5xl font-bold">
            {experience.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">

            <p className="text-gray-500">
              {new Date(
                experience.created_at
              ).toLocaleDateString()}
            </p>

            {isOwner && (
              <>
                <Link
                  href={`/edit/${experience.id}`}
                  className="rounded-lg border border-purple-500 px-4 py-2 text-sm text-purple-300 transition hover:bg-purple-600 hover:text-white"
                >
                  ✏️ Edit
                </Link>

                <button
                  onClick={deleteExperience}
                  className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-600 hover:text-white"
                >
                  🗑 Delete
                </button>
             </>
            )}

          </div>

        </div>

      </header>

      <section className="max-w-5xl mx-auto space-y-10 px-6 py-12">

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            🤔 Decision
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.decision}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            📖 Full Story
          </h2>

          <p className="whitespace-pre-wrap leading-8 text-gray-300">
            {experience.story}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            💡 Biggest Lesson
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.lesson}
          </p>

        </div>

        <div className="rounded-3xl border border-gray-800 bg-zinc-900 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            🎯 Advice for Others
          </h2>

          <p className="leading-8 text-gray-300">
            {experience.advice}
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold transition hover:scale-105"
          >
            ❤️ Like
          </button>

          <button
            className="rounded-xl border border-gray-700 px-6 py-3 transition hover:bg-zinc-800"
          >
            🔖 Bookmark
          </button>
         </div>

      </section>

    </main>
  );
}