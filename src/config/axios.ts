import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { ApiErrorResponse } from "../types/errorResponseTypes";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Función para refrescar el token
const refreshAccessToken = async () => {
    const { setAccessToken } = useAuthStore.getState();
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/token/refresh`,
            {},
            { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken;
    } catch (err) {
        //resetData(); // limpia sesión → logout
        throw err;
    }
};

api.interceptors.request.use(async (config) => {
    const { accessToken, isAuthenticated } = useAuthStore.getState();

    if (!accessToken && isAuthenticated) {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
    } else if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (error.response) {

            const data = error.response.data as ApiErrorResponse;

            // Token expirado → intentar refresh
            if (
                isAuthenticated &&
                data.status === 401 &&
                data.path !== "/api/auth/login"
            ) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            // Rechazar con un objeto consistente con ApiErrorResponse
            return Promise.reject(data);
        }

        // Si no hay response → error de red
        return Promise.reject({
                message: "No se pudo conectar con el servidor.",
                status: 500,
                error: "NETWORK_ERROR",
                path: "",
                timestamp: new Date().toISOString(),
        } as ApiErrorResponse);
    }
);


export default api;
