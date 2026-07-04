import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Relata | Learn From Real Experiences",
  description:
    "Discover authentic experiences shared by real people. Learn before making life's biggest decisions.",

  keywords: [
    "Relata",
    "Real experiences",
    "Life decisions",
    "Career",
    "Education",
    "Relationships",
    "Finance",
    "Startup",
    "Decision making",
  ],

  authors: [{ name: "Relata" }],

  openGraph: {
    title: "Relata | Learn From Real Experiences",
    description:
      "Someone has already lived the decision you're about to make.",
    type: "website",
    siteName: "Relata",
  },

  twitter: {
    card: "summary_large_image",
    title: "Relata | Learn From Real Experiences",
    description:
      "Someone has already lived the decision you're about to make.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
