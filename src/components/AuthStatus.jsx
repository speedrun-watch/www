import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const DISCORD_SCOPES = import.meta.env.VITE_DISCORD_SCOPES;

const AuthStatus = () => {
  const [authStatus, setAuthStatus] = useState({ user: null });
  const [loading, setLoading] = useState(true);

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
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setAuthStatus({ user: null });
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
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
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8 border-2 border-discord-blurple">
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
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default AuthStatus;
