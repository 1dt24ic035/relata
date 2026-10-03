import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-3xl font-bold text-transparent"
            >
              Relata
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-gray-400">
              Learn from real experiences before making life's biggest
              decisions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 font-semibold">Product</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/explore"
                  className="transition hover:text-white"
                >
                  Explore
                </Link>
              </li>

              <li>
                <a
                  href="/#categories"
                  className="transition hover:text-white"
                >
                  Categories
                </a>
              </li>

              <li>
                <Link
                  href="/create"
                  className="transition hover:text-white"
                >
                  Create Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 font-semibold">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="/#about"
                  className="transition hover:text-white"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="mailto:contact@relata.app"
                  className="transition hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-5 font-semibold">Community</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            © 2026 Relata. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Built to help people make better decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}