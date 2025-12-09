import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const CALLBACK_PATH = import.meta.env.VITE_CALLBACK_PATH;

// Debug logging
console.log("Environment Variables:");
console.log("VITE_API_ENDPOINT:", API_ENDPOINT);
console.log("VITE_CALLBACK_PATH:", CALLBACK_PATH);
console.log("Raw import.meta.env:", import.meta.env);

const DiscordCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            // Send the code to the API
            console.log("Code:", code);

            api
                .post(`/${CALLBACK_PATH}`, { code })
                .then((response) => {
                    const { token, user, exp } = response.data;

                    localStorage.setItem("jwt", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("exp", exp);

                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.error("Error during authentication:", error);
                    navigate("/login?error=auth_failed");
                });
        } else {
            navigate("/login?error=no_code");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-discord-darker text-white flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Animated Logo */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <Bell className="w-16 h-16 text-discord-blurple mx-auto animate-pulse" />
                        <div className="absolute inset-0 w-16 h-16 bg-discord-blurple/20 rounded-full animate-ping mx-auto"></div>
                    </div>
                </div>

                {/* Brand */}
                <h1 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-discord-blurple/90 to-discord-fuchsia/80 bg-clip-text text-transparent">
                        Authenticating...
                    </span>
                </h1>

                {/* Loading State */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-discord-blurple rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-discord-blurple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-discord-blurple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-discord-blurple/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-discord-fuchsia/10 rounded-full blur-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default DiscordCallback; 