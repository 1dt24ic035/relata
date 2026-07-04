export default function ExperiencePreview() {
  const stories = [
    {
      emoji: "🎓",
      title: "I chose Computer Science only for the salary...",
      time: "3 min read",
      category: "Education",
    },
    {
      emoji: "💼",
      title: "I quit my stable job to build a startup.",
      time: "5 min read",
      category: "Career",
    },
    {
      emoji: "❤️",
      title: "The relationship red flags I ignored.",
      time: "4 min read",
      category: "Relationships",
    },
  ];

  return (
    <section className="bg-black py-28 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Real Stories. Real Lessons.
          </h2>

          <p className="mt-5 text-lg text-gray-400 max-w-3xl mx-auto">
            Here's the kind of experiences you'll discover on Relata.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {stories.map((story) => (
            <div
              key={story.title}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition duration-300 hover:scale-[1.03] hover:border-purple-500/40 cursor-pointer"
            >
              <div className="text-5xl mb-6">
                {story.emoji}
              </div>

              <div className="inline-block rounded-full bg-purple-600/20 px-4 py-1 text-sm text-purple-300 mb-5">
                {story.category}
              </div>

              <h3 className="text-2xl font-bold leading-snug">
                {story.title}
              </h3>

              <p className="mt-8 text-gray-500">
                {story.time}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}