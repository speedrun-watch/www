
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Bot, ExternalLink, Check, Server, ShieldAlert, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const AddBot = () => {
  return (
    <div className="min-h-screen bg-discord-darker text-white">
      {/* Header */}
      <header className="bg-discord-dark py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Bell className="w-6 h-6 text-discord-blurple" />
            <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple to-discord-fuchsia bg-clip-text text-transparent">
              speedrun.bot
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button asChild size="sm" className="bg-discord-blurple hover:bg-discord-blurple/90">
              <Link to="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block p-4 bg-discord-dark/50 rounded-full mb-6">
              <Bot className="w-16 h-16 text-discord-blurple" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Add speedrun.bot to Discord</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Follow these simple steps to bring real-time speedrunning notifications to your Discord server.
            </p>
          </div>
          
          <div className="space-y-10">
            {/* Step 1 */}
            <div className="glass rounded-lg p-6 relative">
              <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-bold mb-4">Authorize the Bot</h2>
              <p className="mb-5 text-gray-300">
                Click the button below to authorize speedrun.bot with your Discord account. You'll be redirected to Discord's authorization page.
              </p>
              <div className="flex justify-center">
                <Button size="lg" className="bg-discord-blurple hover:bg-discord-blurple/90">
                  <Bot className="mr-2 h-5 w-5" />
                  Add to Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="glass rounded-lg p-6 relative">
              <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h2 className="text-2xl font-bold mb-4">Select Your Server</h2>
              <p className="mb-5 text-gray-300">
                Choose which Discord server you want to add the bot to. You need to have <Badge variant="outline" className="ml-1 font-mono">Manage Server</Badge> permissions to add bots.
              </p>
              <div className="bg-discord-dark/50 rounded-lg p-4 mb-5">
                <div className="flex items-center text-sm text-yellow-300">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <p>Only add bots to servers you trust. This bot will have the permissions listed below.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  <span>Read Messages</span>
                </div>
                <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  <span>Send Messages</span>
                </div>
                <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  <span>Embed Links</span>
                </div>
                <div className="bg-discord-dark/30 p-3 rounded-md flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  <span>Read Message History</span>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="glass rounded-lg p-6 relative">
              <div className="absolute -left-3 -top-3 bg-discord-blurple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <h2 className="text-2xl font-bold mb-4">Set Up Notifications</h2>
              <p className="mb-5 text-gray-300">
                After adding the bot, return to the dashboard to configure which speedrunning events you want to track.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="glass p-4 flex-1 flex flex-col items-center">
                  <Server className="h-8 w-8 text-discord-blurple mb-2" />
                  <h3 className="font-medium">Link Channels</h3>
                  <p className="text-sm text-center text-gray-400">Connect channels to specific games</p>
                </div>
                <div className="glass p-4 flex-1 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 text-discord-green mb-2" />
                  <h3 className="font-medium">Configure Events</h3>
                  <p className="text-sm text-center text-gray-400">Choose which events trigger notifications</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button asChild className="bg-discord-blurple hover:bg-discord-blurple/90">
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Need help? Join our <a href="#" className="text-discord-blurple hover:underline">support server</a> or check the <a href="#" className="text-discord-blurple hover:underline">documentation</a>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddBot;
