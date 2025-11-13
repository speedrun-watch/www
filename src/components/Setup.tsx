
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlusCircle,
  Settings,
  Gamepad,
  BellRing,
  MessageSquare,
  CheckCircle,
  User,
  Users
} from "lucide-react";

const Setup = () => {
  const [authStatus, setAuthStatus] = useState({ user: null });
  const [loading, setLoading] = useState(true);

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

  const getSteps = () => [
    {
      number: "1",
      title: "Add Bot to Server",
      description: "Invite speedrun.watch to your Discord server with just a few clicks.",
      icon: <PlusCircle className="w-6 h-6 text-discord-blurple/80" />,
      buttonText: "Add to Discord",
      buttonIcon: <MessageSquare className="w-4 h-4" />,
      action: () => window.open('https://discord.com/oauth2/authorize?client_id=1311698143733354537&permissions=2214751313&integration_type=0&scope=bot', '_blank')
    },
    {
      number: "2",
      title: authStatus.user ? "✓ Signed in as Admin" : "Sign in as Admin",
      description: authStatus.user
        ? `You're signed in as ${authStatus.user.username}. You can now configure games and notifications.`
        : "Sign in to configure which games and channels to track.",
      icon: authStatus.user
        ? <CheckCircle className="w-6 h-6 text-discord-green/80" />
        : <User className="w-6 h-6 text-discord-green/80" />,
      buttonText: authStatus.user ? undefined : "Login with Discord",
      buttonIcon: authStatus.user ? undefined : <ArrowRight className="w-4 h-4" />,
      action: authStatus.user
        ? undefined
        : () => {
          const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
          const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
          const DISCORD_SCOPES = import.meta.env.VITE_DISCORD_SCOPES;
          const REDIRECT_URI = encodeURIComponent(FRONTEND_URL + "/login/callback");
          const SCOPES = encodeURIComponent(DISCORD_SCOPES);
          const signInUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
          window.location.href = signInUrl;
        }
    },
    {
      number: "3",
      title: "Configure Notifications",
      description: "Sign in to your dashboard to link games to channels and choose notification settings.",
      icon: <BellRing className="w-6 h-6 text-discord-yellow/80" />,
      buttonText: authStatus.user ? "Go to Dashboard" : undefined,
      buttonIcon: authStatus.user ? <ArrowRight className="w-4 h-4" /> : undefined,
      action: authStatus.user ? () => window.open('/dashboard', '_self') : undefined
    },
  ];

  if (loading) {
    return (
      <section id="setup" className="py-20 bg-discord-darker relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-discord-dark/50 rounded-full animate-pulse mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  const steps = getSteps();
  return (
    <section id="setup" className="py-20 bg-discord-darker relative">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiM1ODY1RjIiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="inline-block text-2xl md:text-3xl font-bold bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent mb-4">
            Setup in Minutes
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get your server set up with game notifications in just a few simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ol className="relative border-l-2 border-discord-blurple/30 ml-4 md:ml-8 space-y-10">
            {steps.map((step, index) => (
              <li key={index} className="ml-8 md:ml-12">
                <div className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-discord-blurple/80 text-white font-medium">
                  {step.number}
                </div>

                <Card className="border-0 overflow-hidden bg-discord-dark/30 backdrop-blur-sm shadow-md">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-discord-darker/60 w-12 h-12 rounded-lg flex items-center justify-center mr-4 border border-discord-blurple/10">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-medium text-white">{step.title}</h3>
                    </div>

                    <p className="text-gray-300 mb-6">{step.description}</p>

                    {step.buttonText && (
                      step.number === "3" && authStatus.user ? (
                        <Link to="/dashboard">
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto bg-transparent border-white/10 text-white hover:bg-white/5"
                          >
                            {step.buttonIcon && <span className="mr-2">{step.buttonIcon}</span>}
                            {step.buttonText}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant={index === 0 ? "default" : "outline"}
                          className={index === 0
                            ? "w-full sm:w-auto bg-discord-blurple/80 hover:bg-discord-blurple/70 text-white"
                            : "w-full sm:w-auto bg-transparent border-white/10 text-white hover:bg-white/5"
                          }
                          onClick={step.action}
                        >
                          {step.buttonIcon && <span className="mr-2">{step.buttonIcon}</span>}
                          {step.buttonText}
                        </Button>
                      )
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </div>

        {/* <div className="mt-16 p-6 rounded-lg max-w-3xl mx-auto bg-discord-dark/30 backdrop-blur-sm shadow-md border border-white/5">
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-discord-green/80 mr-2" />
            Already using our bot?
          </h3>
          <p className="text-gray-300 mb-6">
            Login to manage your settings, view statistics, and customize your notification preferences.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-discord-blurple/80 hover:bg-discord-blurple/70 text-white">
              Login with Discord
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              View Dashboard
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Setup;
