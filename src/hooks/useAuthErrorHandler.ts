import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'react-toastify';

export const useAuthErrorHandler = () => {
    const navigate = useNavigate();
    const { resetData, setLastVisitedURL } = useAuthStore();

    const handleAuthError = (pathname: string, message?: string) => {
        localStorage.removeItem("AUTH_TOKEN");
        resetData();
        setLastVisitedURL(pathname);
        toast.error(message || 'Sesión expirada o permisos insuficientes. Inicia sesión nuevamente.');
        navigate('/login');
    };

    return { handleAuthError };
};