import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../types/userTypes";
import { useAuthStore } from "../stores/useAuthStore";
import { ArrowRightEndOnRectangleIcon, Bars3Icon, BellIcon, LockClosedIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { getAllNotificationsByUser } from "../api/NotifyAPI";

type HeaderProps = {
    user: UserData | undefined
}

function Header({user} : HeaderProps) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { resetData, userData, setNotifications, setIsLoadingNotify } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => setMenuOpen(true);
    const handleMenuClose = () => setMenuOpen(false);

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.resetQueries({ queryKey: ['currentUser'] });
        resetData();
        navigate('/login');
    };

    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotificationsByUser,
        enabled: userData !== null && userData !== undefined,
        refetchInterval: 30000,
    });

    useEffect(() => {
        setIsLoadingNotify(isLoading);
    }, [isLoading])

    useEffect(() => {
        if(data) setNotifications(data);
    }, [data])

    const unreadNotify = data ? data.filter(notify => !notify.isRead).length : 0;
    const displayUnreadNotify = unreadNotify > 99 ? '99+' : unreadNotify;

    return (
        <header className="bg-gray-900 text-white shadow-xl">
            <div className="max-w-[50rem] lg:max-w-[60rem] mx-auto flex items-center justify-between px-4 py-5">
        
                
                <Link to="/" className="flex">
                    <h1 className="text-4xl font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-300">
                        ForoHub
                    </h1>
                </Link>
              

                {localStorage.getItem('AUTH_TOKEN') ? (
                    <div className="gap-3 sm-500:gap-4 text-sm sm-500:text-base text-center flex">
                     
                         <button
                            className={`block sm-500:hidden relative rounded-t-md cursor-pointer p-1 duration-300 ${menuOpen ? 'bg-gray-800 text-teal-600' : 'bg-gray-900 text-teal-400'}`}
                            onMouseEnter={handleMenuToggle} 
                            onMouseLeave={handleMenuClose}
                        >
                            <Bars3Icon className="w-8" title="Menú"/>
                            
                            {!menuOpen && unreadNotify !== 0 &&  (
                                <span className={`${unreadNotify > 99 ? '-right-3' : '-right-1'} absolute -top-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full`}>
                                    {displayUnreadNotify}
                                </span>
                            )}
                            
                        </button>

                        {menuOpen && (
                            <div 
                                className="absolute top-14 right-4 bg-gray-800 shadow-lg rounded-lg w-auto p-4 z-50"
                                onMouseEnter={handleMenuToggle}
                                onMouseLeave={handleMenuClose}
                            >
                                <div className="flex flex-col gap-3 divide-y-2 divide-gray-700">
                                    <Link
                                        to="/notifications"
                                        className="relative flex items-center gap-2 text-gray-200 hover:text-gray-400 duration-300"
                                    >
                                        <BellIcon className="w-5 h-5" />
                                        Notificaciones
                                        {unreadNotify !== 0 && (
                                            <span className="absolute left-2 -top-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                                {displayUnreadNotify}
                                            </span>
                                        )}
                                        
                                    </Link>
                                    
                                    <Link
                                        to="/profile"
                                        className="pt-2 flex items-center gap-2 text-teal-400 hover:text-teal-600 duration-300"
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                        Ver Perfil
                                    </Link>
                                    
                                    <button
                                        onClick={logout}
                                        className="pt-2 flex items-center gap-2 text-red-500 hover:text-red-700 duration-300"
                                    >
                                        <ArrowRightEndOnRectangleIcon className="w-5 h-5 rotate-180" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-gray-200 hidden md:flex items-center">
                            <span className="truncate block max-w-[15rem] lg:max-w-[22rem]">
                                Bienvenido, {user ? user.username : 'Usuario'}
                            </span>
                        </div>
                       
                        <div className="hidden sm-500:flex relative justify-center items-center mx-1">
                            <Link to="/notifications" className="group">
                                <BellIcon className="w-7 text-gray-200 group-hover:text-gray-400 transition-colors duration-300" title="Notificaciones"/>
                                {unreadNotify !== 0 && (
                                    <span className={`${unreadNotify > 99 ? '-top-[0.20rem] -right-4' : 'top-[0.10rem] -right-2'} absolute bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full`}>
                                        {displayUnreadNotify}
                                    </span>
                                )}
                            </Link>                
                        </div>

                        <Link to="/profile" className="hidden sm-500:flex px-3 sm-500:px-4 py-1.5 sm-500:py-2 border-2 border-teal-400 bg-teal-400 text-gray-900 rounded-md hover:bg-teal-500 hover:border-teal-500 transition-colors duration-300">
                            Ver Perfil
                        </Link>
                        
                        <button onClick={logout} className="hidden sm-500:flex px-3 sm-500:px-4 py-1.5 sm-500:py-2 border-2 border-red-500  text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300">
                             Cerrar sesión
                        </button>
                    </div>
                ) : (
                    
                    <div className="flex gap-3 sm-500:gap-4">
                        <button
                             className={`block sm-500:hidden relative rounded-t-md cursor-pointer p-1 duration-300 ${menuOpen ? 'bg-gray-800 text-teal-600' : 'bg-gray-900 text-teal-400'}`}
                            onMouseEnter={handleMenuToggle} 
                            onMouseLeave={handleMenuClose}
                        >
                            <Bars3Icon className="w-8" />
                        </button>
                        {menuOpen && (
                            <div 
                                className="absolute top-14 right-4 bg-gray-800 shadow-lg rounded-lg w-auto p-4 z-50"
                                onMouseEnter={handleMenuToggle}
                                onMouseLeave={handleMenuClose}
                            >
                                <div className="flex flex-col gap-3 divide-y-2 divide-gray-700">
                                    <Link
                                        to="/login"
                                        className="text-teal-400 hover:text-teal-600 duration-300 flex items-center gap-2"
                                    >
                                        <LockClosedIcon className="w-5 h-5 text-inherit" />
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-teal-400 hover:text-teal-600 duration-300 flex items-center gap-2 pt-2"
                                    >
                                        <PencilSquareIcon className="w-5 h-5 text-inherit" />
                                        Registrarse
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className="hidden sm-500:flex gap-4">
                            <Link
                                to="/login"
                                className="px-3 sm-500:px-4 py-1.5 sm-500:py-2 border-2 border-teal-400 bg-teal-400 text-gray-900 rounded-md hover:bg-teal-500 hover:border-teal-500 transition-colors duration-300"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 sm-500:px-4 py-1.5 sm-500:py-2 bg-transparent border-2 border-teal-400 text-teal-400 rounded-md hover:bg-teal-400 hover:text-gray-900 transition-colors duration-300"
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
