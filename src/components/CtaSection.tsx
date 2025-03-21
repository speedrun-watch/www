
import { Button } from "@/components/ui/button";
import { MessageSquare, Gamepad } from "lucide-react";

// Popular games using the bot
const popularGames = [
  { name: "Half-Life 2", icon: "🔫" },
  { name: "Minecraft", icon: "⛏️" },
  { name: "Super Mario 64", icon: "🍄" },
  { name: "Portal", icon: "🔵" },
  { name: "GTA: San Andreas", icon: "🚗" },
  { name: "Doom Eternal", icon: "👹" },
  { name: "The Legend of Zelda: BotW", icon: "🏹" },
  { name: "Celeste", icon: "🏔️" }
];

const CtaSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-discord-blurple/10 to-discord-fuchsia/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-discord-blurple/20 to-discord-fuchsia/20"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-discord-blurple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-discord-fuchsia/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Popular Games Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-xl md:text-2xl font-medium text-white mb-5">
            Popular Games Using speedrun.bot
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {popularGames.map((game, index) => (
              <div 
                key={index}
                className="flex items-center bg-discord-dark/60 px-3 py-1.5 rounded-full"
              >
                <span className="mr-1.5">{game.icon}</span>
                <span className="text-sm">{game.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-medium text-white mb-5">
            Get Started
          </h2>
          <p className="text-base text-gray-300 mb-6 max-w-xl mx-auto">
            Join communities already using speedrun.bot to keep their members updated about the latest achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-discord-blurple/70 hover:bg-discord-blurple text-white py-5 px-6 text-base"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Add to Discord
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white/10 text-white hover:bg-white/5 py-5 px-6 text-base"
            >
              <Gamepad className="mr-2 h-5 w-5" />
              See Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
