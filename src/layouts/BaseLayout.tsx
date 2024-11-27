import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getCurrentUser } from "../api/AuthAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../stores/useAuthStore";
import { useAuthErrorHandler } from "../hooks/useAuthErrorHandler";


function BaseLayout({ isPrivate }: { isPrivate: boolean }) {

    const { pathname } = useLocation();
    const { setData, userData } = useAuthStore();
    const { handleAuthError } = useAuthErrorHandler();

    const { data: user, isLoading, error } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false, 
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setData(user);
    }, [user])

    useEffect(() => {
    
        if (error) {
            let isUnauthorized = false;
            isUnauthorized = isPrivate ? 
                ( error?.message === "Unauthorized" || !localStorage.getItem("AUTH_TOKEN") ) : error?.message === "Unauthorized" 
            if (isUnauthorized) {
                const message = error?.message === "Unauthorized"
                    ? 'Sesión expirada o permisos insuficientes. Inicia sesión nuevamente.'
                    : 'Inicia sesión para continuar.';
    
                handleAuthError(pathname, message);
            }
        }
    }, [error]);

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-[90vh]">
                    <div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <Header user={userData || undefined} />
                    <main className="min-h-[90vh]">
                        <Outlet />
                    </main>
                    <Footer />
                </>
            )}
            
        </>
    );
}

export default BaseLayout