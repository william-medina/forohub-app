import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
});

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401 && error.response.data.error !== "Las credenciales proporcionadas son incorrectas.") {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                return api.request(error.config); // Reintenta la petición original
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
