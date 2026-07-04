export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      emoji: "📝",
      title: "Share Your Experience",
      description:
        "Write about a decision you've made, the mistakes you faced, and the lessons you wish you knew earlier.",
    },
    {
      number: "02",
      emoji: "🔍",
      title: "Discover Real Stories",
      description:
        "Search authentic experiences from people who've already walked the path you're about to take.",
    },
    {
      number: "03",
      emoji: "🚀",
      title: "Make Better Decisions",
      description:
        "Use real-life experiences to avoid costly mistakes and move forward with confidence.",
    },
  ];

  return (
    <section className="bg-black py-28 text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">
          <p className="text-purple-400 font-semibold uppercase tracking-[0.3em] mb-4">
            HOW IT WORKS
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Three Simple Steps
          </h2>

          <p className="mt-5 text-lg text-gray-400 max-w-3xl mx-auto">
            Learn from people who've already been there before making your next
            important decision.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Step Number */}
              <div className="absolute right-8 top-8 text-5xl font-black text-white/5">
                {step.number}
              </div>

              {/* Emoji */}
              <div className="mb-8 text-5xl transition-transform duration-300 group-hover:scale-110">
                {step.emoji}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl font-bold">
                {step.title}
              </h3>

              {/* Description */}
              <p className="leading-7 text-gray-400">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}