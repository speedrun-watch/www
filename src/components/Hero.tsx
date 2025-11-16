
import { Button } from "@/components/ui/button";
import {
  Bell,
  Gamepad,
  MessageSquare,
  ChevronDown,
  Timer,
  Trophy,
  Flag,
  ThumbsUp,
  MessageCircle,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[#23272A]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM1ODY1RjIiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-discord-blurple/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-discord-fuchsia/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 mb-12">
          <div className="inline-block animate-float">
            <div className="flex items-center space-x-2 bg-discord-dark/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <div className="relative flex items-center justify-center">
                <Bell className="w-5 h-5 text-discord-blurple/80 absolute animate-ping opacity-60" />
                <Bell className="w-5 h-5 text-discord-blurple/80 relative" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
                  Speedrun Alerts
                </span>{" "}
                for Discord Servers
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Keep your Discord community updated about new speedruns as they happen.
            Get notifications when runners share their achievements on speedrun.com.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              className="bg-discord-blurple/90 hover:bg-discord-blurple/80 text-white w-full sm:w-auto px-6 py-5"
              size="lg"
              onClick={() => window.open('https://discord.com/oauth2/authorize?client_id=1311698143733354537&permissions=2214751313&integration_type=0&scope=bot', '_blank')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Add to Discord
            </Button>
            {/* <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5 w-full sm:w-auto px-6 py-5"
              size="lg"
              onClick={scrollToFeatures}
            >
              <Gamepad className="mr-2 h-5 w-5" />
              See Features
            </Button> */}
          </div>
        </div>

        {/* Bot Preview - Half-Life 2 WR Notification */}
        <div className="mt-12 max-w-3xl mx-auto glass rounded-lg overflow-hidden animate-scale-in border border-white/5 shadow-md">
          <div className="bg-discord-dark/80 p-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 text-gray-400 text-xs">Discord - SourceRuns Team</div>
          </div>
          <div className="p-4 bg-discord-darker/90 text-white">
            <div className="flex items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/80 flex items-center justify-center mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                </svg>
              </div>
              <div className="w-full border-l-4 border-yellow-500/70 pl-3">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-white mr-2">speedrun.watch</span>
                  <span className="bg-blue-600/90 text-xs font-medium px-2 py-0.5 rounded text-white">APP</span>
                  <span className="text-gray-400 text-xs ml-2">Today at 18:22</span>
                </div>
                <div className="mb-2">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-medium">Buster12</span>&nbsp;has achieved a new world record!
                  </span>
                </div>
                <a href="https://www.speedrun.com/hl2/runs/ylpx8grm" target="_blank" rel="noopener noreferrer" className="mb-2 font-bold text-blue-400 hover:underline flex items-center">
                  Any% No Voidclip - 37m 20s 055ms
                  <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
                </a>
                <div className="font-medium text-white mb-2">
                  <a href="https://www.speedrun.com/hl2" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Half-Life 2
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Platform</div>
                    <div>PC</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Category</div>
                    <div>Any%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Date</div>
                    <div className="text-yellow-300/90">August 23, 2023</div>
                  </div>
                </div>
                <div className="mb-3 relative rounded overflow-hidden">
                  {/* Real speedrun thumbnail instead of YouTube placeholder */}
                  <div className="relative">
                    <div className="aspect-video bg-black">
                      <img
                        src="https://img.youtube.com/vi/CBgo4WVG_3I/0.jpg"
                        alt="Speedrun.com gaming thumbnail"
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center bg-discord-dark/60 px-2 py-1 rounded-full">
                    <Heart className="w-3.5 h-3.5 text-red-400 mr-1.5" />
                    <span className="text-xs">42</span>
                  </div>
                  <div className="flex items-center bg-discord-dark/60 px-2 py-1 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                    <span className="text-xs">21</span>
                  </div>
                  <div className="flex items-center bg-discord-dark/60 px-2 py-1 rounded-full">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400 mr-1.5" />
                    <span className="text-xs">15</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-discord-dark/30 rounded-md p-2 mb-2">
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-white">G</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-blue-400 text-sm font-medium">gocnak</span>
                        <span className="text-gray-400 text-xs ml-2">Just now</span>
                      </div>
                      <p className="text-sm text-gray-300">Incredible improvement on the last segment! That's an amazing achievement!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-discord-dark/30 rounded-md p-2">
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-purple-500/80 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs text-white">W</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-purple-400 text-sm font-medium">waezone</span>
                        <span className="text-gray-400 text-xs ml-2">Just now</span>
                      </div>
                      <p className="text-sm text-gray-300">That skip at 15:42 was clean!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
