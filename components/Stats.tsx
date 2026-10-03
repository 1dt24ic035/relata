export default function Stats() {
  const stats = [
    {
      icon: "🧠",
      title: "Learn From Experience",
      description:
        "Discover what people learned from the journeys they've already lived.",
    },
    {
      icon: "💡",
      title: "Make Better Decisions",
      description:
        "Get practical insights that can help you make more informed choices.",
    },
    {
      icon: "🌍",
      title: "Real Stories From Real People",
      description:
        "Explore genuine experiences shared by people who have actually lived them.",
    },
  ];

  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Why Relata?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Real experiences can give you the perspective you need before
            making your next decision.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-purple-500/40"
            >
              <div className="mb-6 text-5xl">
                {item.icon}
              </div>

              <h3 className="text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}