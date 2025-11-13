import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'react-toastify';
import { AppConfig } from '../config/env';

export const useAuthErrorHandler = () => {
    const navigate = useNavigate();
    const { resetData, setLastVisitedURL } = useAuthStore();

    const handleAuthError = (pathname: string, message?: string) => {
        resetData();
        setLastVisitedURL(pathname);
        AppConfig.isMicroservices ? null : toast.error(message || 'Sesión expirada o permisos insuficientes. Inicia sesión nuevamente.');
        setTimeout(() => {
                    navigate('/login');

        }, 2000);
    };

    return { handleAuthError };
};