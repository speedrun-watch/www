
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

    // Update document title to reflect speedrun.bot
    document.title = "speedrun.bot - Speedrun Notifications for Discord";

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-discord-darker text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Setup />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
