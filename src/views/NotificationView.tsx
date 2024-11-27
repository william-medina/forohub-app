import { useEffect, useState } from "react";
import { ChatBubbleBottomCenterTextIcon, CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../stores/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotify, markNotificationAsRead } from "../api/NotifyAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { formatRelativeDate } from "../utils";
import { toast } from "react-toastify";
import { useAuthErrorHandler } from "../hooks/useAuthErrorHandler";
import { } from "@heroicons/react/16/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

function NotificationView() {
 
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { notifications: data, isloadingNotify, userData } = useAuthStore();
    const [expandedNotification, setExpandedNotification] = useState<number | null>(null);
    const { handleAuthError } = useAuthErrorHandler();


    useEffect(() => {
        window.scrollTo(0, 0);
        queryClient.invalidateQueries({ queryKey: ["notifications"]});
    }, [])

    const toggleNotification = (id: number) => {
        setExpandedNotification((prev) => (prev === id ? null : id));
    };

    const invalidateQuery = () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"]});
    }

    const markAsReadMutate = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: invalidateQuery
    })

    const deleteMutate = useMutation({
        mutationFn: deleteNotify,
        onError: (error) => {
            if(error.message === "Unauthorized") {
                handleAuthError(pathname);
            } else {
                toast.error(error.message || "Error inesperado. Intenta nuevamente.");
            }
        },
        onSuccess: () => {
            invalidateQuery();
            toast.success('Notificación eliminada!');
        }
    })

    const handleDeleteNotification = (notifyId: number) => {
        deleteMutate.mutate(notifyId);
    };

    const handleRedirectToTopic = (topicId: number) => {
       navigate(`/topic/${topicId}`)

    };

    const handleMarkAsRead = (notifyId: number) => {
        markAsReadMutate.mutate(notifyId);
    };

    const getSubtypeIcon = (subtype: string) => {
        switch (subtype) {
            case "REPLY":
                return <ChatBubbleBottomCenterTextIcon className="w-4 sm-500:w-5 text-teal-400" />;
            case "EDITED":
                return <PencilIcon className="w-4 sm-500:w-5 text-teal-400" />;
            case "SOLVED":
                return <CheckCircleIcon className="w-4 sm-500:w-5 text-teal-400" />;
            case "DELETED":
                return <XCircleIcon className="w-4 sm-500:w-5 text-red-400" />;
            default:
                return null;
        }
    };

    return (
        <section className="max-w-[50rem] lg:max-w-[60rem] py-6 mx-auto px-4 text-white">
            <h2 className="my-5 text-3xl text-teal-400 font-semibold">Notificaciones</h2>
                {isloadingNotify ? (
                    <div className="flex justify-center items-center h-[60vh]">
                        <div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin" />
                    </div>
                ) : !userData ? (
                    <div className="flex justify-center items-center text-red-500 py-20 sm-500:py-24 text-sm sm-500:text-base h-[60vh] w-full">
                        <ExclamationCircleIcon className="w-6 sm-500:w-7 mr-1 sm-500:mr-2" />
                        <span>Error al cargar notificaciones.</span>
                    </div>
                ) : data?.length! > 0 ? (
                    <div className="max-h-[70vh] overflow-y-auto">
                        {data?.map((notify) => (
                            <div
                                key={notify.id}
                                className={`flex flex-col gap-2 p-4 border-b border-gray-700 ${
                                    expandedNotification === notify.id ? "bg-gray-800" : "bg-gray-900"
                                } hover:bg-gray-800 transition-colors duration-300 rounded-md`}
                            >
                                <div 
                                    className="flex items-center justify-between cursor-pointer mb-2" 
                                    onClick={() => {
                                        toggleNotification(notify.id);
                                        if (!notify.isRead) handleMarkAsRead(notify.id);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Ícono del subtipo */}
                                        <div className="w-auto">
                                            {getSubtypeIcon(notify.subtype)}
                                        </div>
                                        {/* Título */}
                                        <div className="flex items-center gap-2">
                                            <h3
                                                className={`leading-4 sm-500:leading-5 text-[1rem] sm-500:text-[1.125rem] select-none ${
                                                    expandedNotification === notify.id ? (notify.isRead ? "text-teal-400" : "text-teal-400 font-semibold") : (notify.isRead ? "text-gray-400" : "text-gray-200 font-semibold")
                                                } hover:text-teal-400 duration-300`}
                                            >
                                                {notify.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="select-none ml-2">
                                        {/* Etiqueta "Nuevo" */}
                                        {!notify.isRead && (
                                            <span className="bg-teal-500 mr-3 text-white text-[0.6rem] sm-500:text-xs font-semibold px-2 py-1 rounded-full">
                                                Nuevo
                                            </span>
                                        )}
                                        {expandedNotification === notify.id ? (
                                            <span className="text-teal-400 text-xs">▲</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">▼</span>
                                        )}
                                    </div>
                                </div>
                                {/* Mensaje expandible */}
                                {expandedNotification === notify.id && (
                                    <div className="mt-2 text-sm sm-500:text-base text-gray-300">
                                        <p>{notify.message}</p>

                                        <div
                                            className={`flex items-center gap-4 mt-3 justify-between`}
                                        >
                                            {/* Botón para redirigir al tópico */}
                                           
                                            <button
                                                className={`border-2 border-teal-400 hover:bg-teal-400 text-teal-400 hover:text-gray-900 
                                                    disabled:text-gray-500 disabled:border-gray-500 
                                                    disabled:hover:bg-gray-800 disabled:cursor-not-allowed px-3 py-2 my-3 
                                                    text-xs sm-500:text-sm rounded-lg duration-300`}
                                                onClick={() => handleRedirectToTopic(notify.topicId || 0)}
                                                disabled={!notify.topicId}
                                            >
                                                {!notify.topicId ? "No Disponible" : "Ir al Tópico"}
                                            </button>
                                           

                                            {/* Botón para eliminar */}
                                            <TrashIcon
                                                className="w-5 sm-500:w-6 text-red-400 hover:text-red-600 cursor-pointer"
                                                onClick={() => handleDeleteNotification(notify.id)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Fecha */}
                                <div className="flex flex-col sm-380:flex-row justify-between leading-3 text-xs text-gray-500 gap-1">
                                    <p>{formatRelativeDate(new Date(notify.createdAt))}</p>
                                    <p>{new Date(notify.createdAt).toLocaleString()}</p>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                        <h3 className="text-lg sm:text-xl font-semibold">Sin Notificaciones</h3>
                        <p className="text-sm sm:text-base mt-2 text-center">
                            No tienes notificaciones disponibles en este momento. 
                        </p>
                    </div>
                )}
            
        </section>
    );
}

export default NotificationView;
