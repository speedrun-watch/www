import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
            const apiUrl = `${API_ENDPOINT}/${CALLBACK_PATH}`;

            console.log("API URL:", apiUrl);
            console.log("Code:", code);

            axios
                .post(apiUrl, { code })
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
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl font-semibold">Authenticating...</div>
        </div>
    );
};

export default DiscordCallback; 