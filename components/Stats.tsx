export default function Stats() {
  const stats = [
    {
      icon: "🧠",
      title: "Learn Faster",
      description:
        "Learn from people who've already been through the journey you're about to start.",
    },
    {
      icon: "💡",
      title: "Avoid Costly Mistakes",
      description:
        "Discover lessons that could save you time, money, and years of trial and error.",
    },
    {
      icon: "🌍",
      title: "Built by Real People",
      description:
        "Every experience comes from someone who's lived it—not AI, not theory.",
    },
  ];

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            Why People Will Use Relata
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            The best advice doesn't always come from books or search engines.
            Sometimes it comes from someone who's already lived your future.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition duration-300 hover:border-purple-500/40 hover:scale-[1.02]"
            >
              <div className="text-5xl mb-6">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-400 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}