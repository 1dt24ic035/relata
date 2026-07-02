export default function HowItWorks() {
  const steps = [
    {
      emoji: "📝",
      title: "Share Your Experience",
      description:
        "Write about a decision you've already made and the lessons you learned.",
    },
    {
      emoji: "🔍",
      title: "Search Real Stories",
      description:
        "Explore authentic experiences from people who have already faced similar decisions.",
    },
    {
      emoji: "💡",
      title: "Make Better Decisions",
      description:
        "Learn from others before taking your next big step with confidence.",
    },
  ];

  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How Relata Works
          </h2>

          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Learn from people who have already walked the path you're about to
            take.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-800 bg-gradient-to-b from-zinc-900 to-black p-8 hover:border-purple-500 transition-all duration-300"
            >
              <div className="text-5xl mb-6">
                {step.emoji}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {step.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}