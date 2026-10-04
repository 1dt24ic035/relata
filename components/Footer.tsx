import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* About */}
        <section id="about" className="mb-20 scroll-mt-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
              ABOUT RELATA
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Real experiences.
              <br />
              Better decisions.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              Relata is a platform built around one simple idea:
              people can make better decisions when they learn from
              experiences others have already lived.
            </p>

            <p className="mt-4 text-lg leading-8 text-gray-400">
              Share what you've learned, discover real stories, and
              gain perspective before making your next important decision.
            </p>
          </div>
        </section>

        {/* Footer Grid */}
        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
                Relata
              </h2>
            </Link>

            <p className="mt-5 max-w-xs leading-7 text-gray-400">
              Learn from real experiences before making life's biggest
              decisions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Product
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/login"
                  className="transition hover:text-white"
                >
                  Explore
                </Link>
              </li>

              <li>
                <Link
                  href="/#categories"
                  className="transition hover:text-white"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="transition hover:text-white"
                >
                  Create Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/#about"
                  className="transition hover:text-white"
                >
                  About
                </Link>
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
            <h3 className="mb-5 font-semibold text-white">
              Community
            </h3>

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

        {/* Bottom */}
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