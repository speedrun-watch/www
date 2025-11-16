
import { Heart } from "lucide-react";
import { siGithub, siDiscord } from "simple-icons/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [pulsing, setPulsing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // some browsers pass a MediaQueryListEvent, others pass the MediaQueryList itself
      // both have `matches`.
      // @ts-ignore
      setPrefersReducedMotion(e.matches);
    };

    // set initial value
    setPrefersReducedMotion(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handleChange as EventListener);
      return () => mq.removeEventListener("change", handleChange as EventListener);
    }

    // fallback for older browsers
    // @ts-ignore
    if (typeof mq.addListener === "function") {
      // @ts-ignore
      mq.addListener(handleChange);
      return () => {
        // @ts-ignore
        mq.removeListener(handleChange);
      };
    }
  }, []);

  const handleHeartClick = () => {
    if (prefersReducedMotion) return;
    setPulsing(false);
    window.setTimeout(() => setPulsing(true), 10);
  };

  return (
    <footer className="bg-discord-darker text-gray-300 pt-1 pb-6 ">
      <div className="container mx-auto">
        <div className="border-t border-gray-800/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex space-x-4">
              <a
                href="https://discord.gg/6FskUx7qv7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="Discord"
              >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    role="img"
                  >
                    <path d={siDiscord.path} />
                  </svg>
              </a>
              <a
                href="https://github.com/speedrun-watch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="GitHub"
              >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    role="img"
                  >
                    <path d={siGithub.path} />
                  </svg>
              </a>
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                to="/terms-of-service"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <p className="text-base text-gray-500 flex items-center mt-4 md:mt-0">
            <span>Made with</span>
            <Heart
              className={`w-6 h-6 text-discord-red/70 mx-1 cursor-pointer heart-no-tap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-discord-blurple/60 ${pulsing && !prefersReducedMotion ? 'animate-heart-beat' : ''}`}
              onClick={handleHeartClick}
              onAnimationEnd={() => setPulsing(false)}
              role="button"
              aria-label="favorite"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleHeartClick();
                }
              }}
            />
            <span>for <a href="https://www.speedrun.com/" target="_blank" rel="noopener noreferrer" className="hover:text-discord-blurple/80 transition-colors">speedrunners</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
