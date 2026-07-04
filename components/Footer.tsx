export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Top */}
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Relata
            </h2>

            <p className="mt-5 text-gray-400 leading-7">
              Learn from real experiences before making life's biggest
              decisions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-5">Product</h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                Explore
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Categories
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Early Access
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-5">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                About
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Roadmap
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-5">Follow</h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                Instagram
              </li>
              <li className="hover:text-white cursor-pointer transition">
                LinkedIn
              </li>
              <li className="hover:text-white cursor-pointer transition">
                X (Twitter)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">
            © 2026 Relata. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Built to help people make better decisions.
          </p>

        </div>

      </div>
    </footer>
  );
}