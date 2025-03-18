
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Menu, 
  X, 
  Bell, 
  LogIn, 
  Settings
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-discord-dark/80 backdrop-blur-sm py-2 shadow-md" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-discord-blurple/90 animate-pulse-light" />
            <span className="text-xl font-bold bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
              speedrun.bot
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a 
              href="#setup" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Setup
            </a>
            <Link
              to="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link to="/login">
              <Button 
                variant="outline" 
                className="bg-transparent border-discord-blurple/70 text-discord-blurple/90 hover:bg-discord-blurple/10 hover:text-white"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Button 
              className="bg-discord-blurple/80 hover:bg-discord-blurple/70 text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Add to Discord
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-discord-darker/80 backdrop-blur-sm rounded-lg animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#setup" 
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Setup
              </a>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-discord-blurple/70 text-discord-blurple/90 hover:bg-discord-blurple/10 hover:text-white"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Button 
                className="w-full bg-discord-blurple/80 hover:bg-discord-blurple/70 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add to Discord
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
