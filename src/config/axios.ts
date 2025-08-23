import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Función para refrescar el token
const refreshAccessToken = async () => {
    const { setAccessToken, resetData } = useAuthStore.getState();
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken;
    } catch (err) {
        resetData(); // limpia sesión → logout
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

        if (
            isAuthenticated &&
            error.response &&
            error.response.status === 401 &&
            error.response.data.error !== "Las credenciales proporcionadas son incorrectas."
        ) {
            const newAccessToken = await refreshAccessToken();
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return api.request(error.config);
        }

        return Promise.reject(error);
    }
);

export default api;
