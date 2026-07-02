export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo & About */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              Relata
            </h2>

            <p className="text-gray-400 mt-4 leading-7">
              Learn from people who have already made the decisions you're about
              to make.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-5">
              Product
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">Explore</li>
              <li className="hover:text-white cursor-pointer">Categories</li>
              <li className="hover:text-white cursor-pointer">Share Story</li>
              <li className="hover:text-white cursor-pointer">Waitlist</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Privacy</li>
              <li className="hover:text-white cursor-pointer">Terms</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-5">
              Stay Updated
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-xl bg-zinc-900 border border-gray-800 px-4 py-3 outline-none focus:border-purple-500"
              />

              <button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 font-semibold hover:scale-105 transition">
                Join Waitlist
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-900 mt-16 pt-8 text-center text-gray-500">
          © 2026 Relata. Built with ❤️ to help people make better decisions.
        </div>

      </div>
    </footer>
  );
}