import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppConfig } from "../../config/env";
import { useAuthStore } from "../../stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

function OAuthCallback() {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { lastVisitedURL, setIsAuthenticated, setAccessToken } = useAuthStore();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
            toast.error("No se recibió el código de autorización");
            navigate("/login");
            return;
        }

        const exchangeCode = async () => {
            try {
                const res = await fetch(`${AppConfig.tokenUrl}/exchange`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        grant_type: "authorization_code", 
                        code,
                        redirect_uri: `${window.location.origin}/oauth2/callback`,
                    }),
                    credentials: "include", 
                });

                if (!res.ok) throw new Error("Error al intercambiar el código");

                const response = await res.json();
                setAccessToken(response.access_token);
                setIsAuthenticated(true);
                queryClient.resetQueries({ queryKey: ["currentUser"] });
                navigate(lastVisitedURL);
            } catch (error) {
                console.error(error);
                toast.error("Error durante la autenticación");
                navigate("/login");
            }
        };

        exchangeCode();
    }, [navigate, setAccessToken]);

    return (
        <div className="flex justify-center items-center h-[90vh]">
            <div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin" />
        </div>
    );
}

export default OAuthCallback;
