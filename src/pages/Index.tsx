
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Setup from "@/components/Setup";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const TITLE = "speedrun.watch - Speedrun Discord Bot";
const DESCRIPTION =
  "Free Discord bot that notifies your server about new verified speedruns from speedrun.com. Track world records, top placements, and new runs for any game automatically.";
const URL = "https://speedrun.watch/";

const Index = () => {
  useEffect(() => {
    const animateOnScroll = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-in");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      const sections = document.querySelectorAll("section > div > div");
      sections.forEach((section) => {
        observer.observe(section);
      });

      return observer;
    };

    const observer = animateOnScroll();
    return () => observer?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-discord-darker text-white overflow-x-hidden flex flex-col">
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={URL} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={URL} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={URL} />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />

      <Navbar />
      <div className="flex-1">
        <Hero />
        <Setup />
        <CtaSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
