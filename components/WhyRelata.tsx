export default function WhyRelata() {
  const comparisons = [
    {
      left: "Search engines give you information.",
      right: "Relata gives you real experiences.",
    },
    {
      left: "Theory explains how things work.",
      right: "Real people show you what actually happens.",
    },
    {
      left: "Learning through mistakes can be costly.",
      right: "Learning from others can help you avoid them.",
    },
  ];

  return (
    <section className="bg-black py-28 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center">
          <p className="mx-auto max-w-3xl text-lg text-gray-400">
            Important decisions are easier when you can learn from people who
            have already experienced what you're about to face.
          </p>
        </div>

        <div className="space-y-8">
          {comparisons.map((item) => (
            <div
              key={item.left}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:border-purple-500/40 md:p-10"
            >
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-xl text-gray-400">
                    {item.left}
                  </p>
                </div>

                <div>
                  <p className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                    {item.right}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}