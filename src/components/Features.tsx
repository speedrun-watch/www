
import { 
  Bell, 
  Settings, 
  Server, 
  Users, 
  Gamepad, 
  BellRing,
  MessageSquare,
  UserCircle
} from "lucide-react";

const features = [
  {
    icon: <Server className="w-10 h-10 text-discord-blurple/80" />,
    title: "Server Configuration",
    description: "Set up which channels receive notifications about new speedruns in your community."
  },
  {
    icon: <Gamepad className="w-10 h-10 text-discord-green/80" />,
    title: "Game Selection",
    description: "Choose which speedrun.com games to follow, with support for any game on the platform."
  },
  {
    icon: <BellRing className="w-10 h-10 text-discord-yellow/80" />,
    title: "Custom Notifications",
    description: "Configure which events you care about - from new runs to world records and personal bests."
  },
  {
    icon: <UserCircle className="w-10 h-10 text-discord-fuchsia/70" />,
    title: "Runner Identity",
    description: "Link your Discord account with speedrun.com to show your Discord tag in notifications."
  },
  {
    icon: <Settings className="w-10 h-10 text-discord-secondary/80" />,
    title: "Advanced Settings",
    description: "Fine-tune notification preferences for each game and Discord channel you care about."
  },
  {
    icon: <Users className="w-10 h-10 text-discord-red/80" />,
    title: "Community Integration",
    description: "Keep everyone updated on the latest records and achievements from your speedrunning friends."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-discord-dark to-discord-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-discord-blurple/60 to-discord-fuchsia/60"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-discord-blurple/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-discord-fuchsia/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="inline-block text-2xl md:text-3xl font-bold bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to keep your Discord server updated with the latest speedrunning achievements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/5 transition-transform duration-300 hover:scale-105 hover:shadow-md"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both"
              }}
            >
              <div className="bg-discord-dark/30 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
