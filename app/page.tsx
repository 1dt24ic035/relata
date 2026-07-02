"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import WaitlistModal from "../components/WaitlistModal";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
      <main className="bg-black text-white">
        <Navbar onJoinClick={() => setIsWaitlistOpen(true)} />

        <Hero onJoinClick={() => setIsWaitlistOpen(true)} />

        <Stats />

        <HowItWorks />

        <Categories />

        <Footer />
      </main>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}