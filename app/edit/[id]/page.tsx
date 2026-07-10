"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditExperiencePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("🎓 Education");
  const [customCategory, setCustomCategory] = useState("");
  const [decision, setDecision] = useState("");
  const [story, setStory] = useState("");
  const [lesson, setLesson] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    loadExperience();
  }, []);

  async function loadExperience() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      alert("Experience not found.");
      router.push("/profile");
      return;
    }

    setTitle(data.title);
    setCategory(data.category);
    setDecision(data.decision);
    setStory(data.story);
    setLesson(data.lesson);
    setAdvice(data.advice);

    setLoading(false);
  }

  const titleValid = title.trim().length >= 10;
  const decisionValid = decision.trim().length >= 20;
  const storyValid = story.trim().length >= 100;
  const lessonValid = lesson.trim().length >= 30;
  const adviceValid = advice.trim().length >= 30;

  const formValid =
    titleValid &&
    decisionValid &&
    storyValid &&
    lessonValid &&
    adviceValid;

  async function saveExperience() {
    if (!formValid) return;

    setSaving(true);

    const { error } = await supabase
      .from("experiences")
      .update({
        title: title.trim(),
        category:
          category === "📦 Other"
            ? customCategory.trim()
            : category,
        decision: decision.trim(),
        story: story.trim(),
        lesson: lesson.trim(),
        advice: advice.trim(),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Experience updated successfully.");
    router.push(`/experiences/${id}`);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

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

          <h1 className="text-4xl font-bold">
            ✏️ Edit Experience
          </h1>

          <p className="mt-2 text-gray-400">
            Update your experience.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-8">
        <div>
            <label className="mb-2 block font-medium">
              Experience Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            >
              <option>🎓 Education</option>
              <option>💼 Career</option>
              <option>🚀 Startup</option>
              <option>💰 Finance</option>
              <option>📈 Investing</option>
              <option>❤️ Relationships</option>
              <option>🏠 Family</option>
              <option>🧠 Mental Health</option>
              <option>🏋️ Health & Fitness</option>
              <option>✈️ Travel</option>
              <option>🌍 Study Abroad</option>
              <option>💻 Technology</option>
              <option>🎨 Creativity</option>
              <option>⚖️ Legal</option>
              <option>🌱 Personal Growth</option>
              <option>📦 Other</option>
            </select>

            {category === "📦 Other" && (
              <input
                type="text"
                placeholder="Specify category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-4 w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              What decision did you make?
            </label>

            <textarea
              rows={3}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Tell your story
            </label>

            <textarea
              rows={7}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Biggest Lesson
            </label>

            <textarea
              rows={4}
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Advice for Others
            </label>

            <textarea
              rows={4}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          <button
            disabled={!formValid || saving}
            onClick={saveExperience}
            className={`w-full rounded-xl py-4 text-lg font-semibold transition ${
              formValid
                ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02]"
                : "cursor-not-allowed bg-gray-700 text-gray-400"
            }`}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>

        </div>
      </section>
    </main>
  );
}