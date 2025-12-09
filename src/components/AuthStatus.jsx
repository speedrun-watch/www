import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid, logout } from "@/lib/auth";

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const DISCORD_SCOPES = import.meta.env.VITE_DISCORD_SCOPES;

const AuthStatus = () => {
  const [authStatus, setAuthStatus] = useState({ user: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const SignInButton = () => {
    const REDIRECT_URI = encodeURIComponent(FRONTEND_URL + "/login/callback");
    const SCOPES = encodeURIComponent(DISCORD_SCOPES);

    const signInUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;

    const handleSignIn = () => {
      window.location.href = signInUrl;
    };

    return (
      <Button
        variant="outline"
        className="bg-transparent border-white/10 text-white hover:bg-white/5"
        onClick={handleSignIn}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  };

  const handleLogout = () => {
    logout();
    setAuthStatus({ user: null });
    navigate("/");
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      if (!isTokenValid()) {
        logout();
        setAuthStatus({ user: null });
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setAuthStatus({ user });
      } catch (error) {
        console.error("Error fetching auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  if (loading) {
    return <div className="w-8 h-8 bg-discord-dark/50 rounded-full animate-pulse" />;
  }

  return (
    <div>
      {authStatus.user ? (
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:block">Dashboard</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="w-8 h-8 border-2 border-discord-blurple cursor-pointer hover:border-discord-blurple/80 transition-colors">
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${authStatus.user.id}/${authStatus.user.avatar}.png`}
                    alt={`${authStatus.user.username}'s avatar`}
                  />
                  <AvatarFallback className="bg-discord-blurple">
                    <User className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300 text-sm hidden md:inline-block">
                  {authStatus.user.username}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-discord-dark border-gray-700">
              <DropdownMenuLabel className="text-gray-300">
                {authStatus.user.username}#{authStatus.user.discriminator}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-gray-300 focus:bg-discord-darker focus:text-white cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default AuthStatus;
