
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Setup from "@/components/Setup";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Add intersection observer for animation on scroll
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

    // Update document title to reflect speedrun.watch
    document.title = "speedrun.watch - Speedrun Notifications for Discord";

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-discord-darker text-white overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Hero />
        {/* <Features /> */}
        <Setup />
        {/* <CtaSection /> */}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
