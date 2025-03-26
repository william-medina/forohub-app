import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { getCurrentUser } from "../api/AuthAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../stores/useAuthStore";
import { useAuthErrorHandler } from "../hooks/useAuthErrorHandler";


function BaseLayout({ isPrivate }: { isPrivate: boolean }) {

    const { pathname } = useLocation();
    const { setData, userData, isAuthenticated } = useAuthStore();
    const { handleAuthError } = useAuthErrorHandler();

    const { data: user, isLoading, error } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false, 
        refetchOnWindowFocus: false,
        enabled: isAuthenticated || isPrivate
    });


    const [showConnectingMessage, setShowConnectingMessage] = useState(false);
    
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowConnectingMessage(true);
            }, 12000);

            return () => clearTimeout(timer); 
        } else {
            setShowConnectingMessage(false);
        }
    }, [isLoading]);
  
    useEffect(() => {
        setData(user);
    }, [user])

    useEffect(() => {

        if(!error) return

        const isUnauthorized = isPrivate 
            ? (error?.message === "Unauthorized" || !isAuthenticated) 
            : (error?.message === "Unauthorized" && isAuthenticated)
        if (isUnauthorized) {
            handleAuthError(pathname, "Sesión expirado o no tienes permisos. Inicia sesión para continuar.");
        }
     
    }, [error]);

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-[90vh] flex-col pt-[4.1rem]">
                    <div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin"></div>
                    <div className={`${showConnectingMessage ? 'visible' : 'invisible'} text-center mt-4`}>
                        <p className="text-teal-500 text-sm sm-500:text-base">Conectando al servidor...</p>
                        <p className="text-teal-500 text-sm sm-500:text-base">Por favor espera unos minutos.</p>
                    </div>
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