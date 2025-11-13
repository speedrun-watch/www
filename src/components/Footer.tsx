
import {
  Twitter,
  Github,
  MessageSquare,
  Mail,
  Heart,
  Bell
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-discord-darker text-gray-300 pt-12 pb-6 ">
      <div className="container mx-auto px-4 md:px-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-discord-blurple/80" />
              <span className="text-lg font-medium bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
                speedrun.watch
              </span>
            </div>
            <p className="mb-4 text-gray-400 text-sm">
              Speedrun notifications for your Discord server.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="Discord"
              >
                <MessageSquare size={18} />
              </a>
              <a
                href="mailto:contact@speedrun.watch"
                className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-400 hover:text-discord-blurple/80 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#setup" className="text-gray-400 hover:text-discord-blurple/80 transition-colors">
                  Setup Guide
                </a>
              </li>
              <li>
                <a href="https://speedrun.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-discord-blurple/80 transition-colors">
                  speedrun.com
                </a>
              </li>
              <li>
                <a href="https://discord.com/developers/docs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-discord-blurple/80 transition-colors">
                  Discord API
                </a>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="border-t border-gray-800/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4">
            <a
              href="https://discord.gg/6FskUx7qv7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
              aria-label="Discord"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
            <a
              href="https://github.com/speedrun-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-discord-blurple/80 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
          <p className="text-xs text-gray-500 flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 text-discord-red/70 mx-1" /> for speedrunners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
