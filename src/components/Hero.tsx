
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
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src="/favicon-96x96.png"
                  alt="speedrun.watch bot avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="w-full border-l-4 border-green-500/70 pl-3">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-white mr-2">speedrun.watch</span>
                  <span className="bg-blue-600/90 text-xs font-medium px-2 py-0.5 rounded text-white inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    APP
                  </span>
                  <span className="text-gray-400 text-xs ml-2">Today at 18:22</span>
                </div>
                <div className="mb-2">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                    {/* <span className="font-medium">Buster12</span>&nbsp;has achieved a new world record! */}
                    <span className="font-medium">Buster12 has achieved a new world record!</span>
                  </span>
                </div>
                <a href="https://www.speedrun.com/hl2/runs/ylpx8grm" target="_blank" rel="noopener noreferrer" className="mb-2 font-bold text-blue-400 hover:underline flex items-center">
                  Any% No Voidclip - 37m 20s 055ms
                </a>
                <div className="font-medium text-white mb-2">
                  <a href="https://www.speedrun.com/hl2" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Half-Life 2
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <div className="text-gray-400">Type</div>
                    <div>Full Game</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Category</div>
                    <div>Any%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Place</div>
                    <div>1st</div>
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
                    <span className="text-xs">4</span>
                  </div>
                  <div className="flex items-center bg-discord-dark/60 px-2 py-1 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                    <span className="text-xs">2</span>
                  </div>
                  <div className="flex items-center bg-discord-dark/60 px-2 py-1 rounded-full">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400 mr-1.5" />
                    <span className="text-xs">1</span>
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
