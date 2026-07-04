export default function WhyRelata() {
  const comparisons = [
    {
      left: "Google gives you information.",
      right: "Relata gives you experience.",
    },
    {
      left: "Books teach theory.",
      right: "People teach reality.",
    },
    {
      left: "Mistakes are expensive.",
      right: "Learning from others is free.",
    },
  ];

  return (
    <section className="bg-black py-28 text-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Relata?
          </h2>

          <p className="mt-5 text-lg text-gray-400 max-w-3xl mx-auto">
            Every day, millions of people make life-changing decisions with
            incomplete information. Relata exists so you can learn from someone
            who's already lived that journey.
          </p>
        </div>

        <div className="space-y-8">

          {comparisons.map((item) => (
            <div
              key={item.left}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 transition duration-300 hover:border-purple-500/40"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">

                <div>
                  <p className="text-gray-400 text-xl">
                    {item.left}
                  </p>
                </div>

                <div>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
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