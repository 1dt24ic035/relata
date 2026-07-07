"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreateExperiencePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("🎓 Education");
  const [customCategory, setCustomCategory] = useState("");
  const [decision, setDecision] = useState("");
  const [story, setStory] = useState("");
  const [lesson, setLesson] = useState("");
  const [advice, setAdvice] = useState("");

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
    adviceValid &&
    (category !== "📦 Other" || customCategory.trim().length >= 3);

  async function publishExperience() {
    if (!formValid) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("========== USER ==========");
    console.log(user);

    if (!user) {
      alert("User is NULL");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      title,
      category: category === "📦 Other" ? customCategory : category,
      decision,
      story,
      lesson,
      advice,
    };

    console.log("========== PAYLOAD ==========");
    console.log(payload);

    const { data, error } = await supabase
      .from("experiences")
      .insert(payload)
      .select();

    console.log("========== RESULT ==========");
    console.log(data);
    console.log(error);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("🎉 Experience Published!");
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold">
            ✍️ Share Your Experience
          </h1>
          <p className="text-gray-400 mt-2">
            Help others make better decisions.
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-8">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"
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
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Specify category"
              className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"
            />
          )}

          <textarea rows={3} value={decision} onChange={(e)=>setDecision(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"/>
          <textarea rows={6} value={story} onChange={(e)=>setStory(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"/>
          <textarea rows={4} value={lesson} onChange={(e)=>setLesson(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"/>
          <textarea rows={4} value={advice} onChange={(e)=>setAdvice(e.target.value)} className="w-full rounded-xl border border-gray-800 bg-zinc-900 px-5 py-4"/>

          <button
            disabled={!formValid || loading}
            onClick={publishExperience}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-4"
          >
            {loading ? "Publishing..." : "🚀 Publish Experience"}
          </button>

        </div>
      </section>
    </main>
  );
}