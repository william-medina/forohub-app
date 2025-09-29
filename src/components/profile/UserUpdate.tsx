import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateCurrentPassword, updateUsername } from "../../api/AuthAPI";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAuthErrorHandler } from "../../hooks/useAuthErrorHandler";
import FormStatusMessage, { FormMessageStatus } from "../FormStatusMessage";
import { UpdateCurrentUserPasswordForm } from "../../types/userTypes";
import { ApiErrorResponse } from "../../types/errorResponseTypes";

function UserUpdate() {

    const { pathname } = useLocation();
    const { handleAuthError } = useAuthErrorHandler();
    const { userData } = useAuthStore();
    const queryClient = useQueryClient();

    const [showSettings, setShowSettings] = useState(false);
    const [errorPasswordMessage, setErrorPasswordMessage] = useState<FormMessageStatus | null>(null);
    const [errorUsernameMessage, setErrorUsernameMessage] = useState<FormMessageStatus | null>(null);

    const initialDataPassword: UpdateCurrentUserPasswordForm = {
        current_password: "",
        password: "",
        password_confirmation: ""
    }

    const [passwordForm, setPasswordForm] = useState(initialDataPassword);
    const [usernameForm, setUsernameForm] = useState({username: ""});

    useEffect(() => {
        if (userData) {
            setUsernameForm({username: userData.username})
        }
    }, [userData])

    const { mutate: mutatePassword, isPending: isPasswordPending } = useMutation({
        mutationFn: updateCurrentPassword,
        onError: (error: ApiErrorResponse) => {
            if(error.status === 401) {
                handleAuthError(pathname);
            } else {
                setErrorPasswordMessage({type: 'error', message:  error.message || "Error inesperado. Intenta nuevamente."});
            }
        },
        onSuccess: () => {
            setPasswordForm(initialDataPassword);
            setErrorPasswordMessage(null);
            toast.success('Password actualizado!');
        }
    })

    const { mutate: mutateUsername, isPending: isUsernamePending } = useMutation({
        mutationFn: updateUsername,
        onError: (error: ApiErrorResponse) => {
            if(error.status === 401) {
                handleAuthError(pathname);
            } else {
                setErrorUsernameMessage({type: 'error', message:  error.message || "Error inesperado. Intenta nuevamente."});
            }
        },
        onSuccess: () => {
            setUsernameForm({username: userData!.username})
            setErrorUsernameMessage(null);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toast.success('Nombre de usuario actualizado!');
        }
    })

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutatePassword(passwordForm)
    }

    const handleUsernameSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutateUsername(usernameForm)
    }

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name] : value
        })
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 mb-4 sm-500:mb-6">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowSettings(!showSettings)}
            >
                <h3 className="text-xl sm-500:text-2xl font-bold text-teal-400">Actualizar</h3>
                <span className="text-teal-400 select-none">{showSettings ? '▲' : '▼'}</span>
            </div>
            {showSettings && (
                <div className="mt-4 flex flex-col sm:flex-row justify-around items-center sm:items-start gap-7">
                    {/* Cambiar Usuario */}
                    <div className="my-5 w-full sm-420:w-60 sm-500:w-80">
                        <h4 className="font-semibold mb-2 text-center">Nombre de Usuario</h4>
                        {errorUsernameMessage && (
                            <FormStatusMessage formStatus={errorUsernameMessage}/>
                        )}
                        <form onSubmit={handleUsernameSubmit} className="mt-3">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={(e) => setUsernameForm({username: e.target.value})}
                                    value={usernameForm?.username || ""}
                                    placeholder="Nuevo Usuario"
                                    className="text-sm sm-500:text-base w-full p-3 rounded-lg bg-gray-900 text-white outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                                    autoComplete="username"
                                    
                                />
                            </div>
                            <button
                                type="submit"
                                className={`${isUsernamePending ? 'cursor-wait border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-gray-600' : 'cursor-pointer border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900'} text-sm sm-500:text-base w-full border-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300`}
                                disabled={isUsernamePending}
                            >
                                Guardar
                            </button>
                        </form>
                    </div>

                    {/* Cambiar Contraseña */}
                    <div className="my-5 w-full sm-420:w-60 sm-500:w-80">
                        <h4 className="font-semibold mb-2 text-center">Password</h4>
                        {errorPasswordMessage && (
                            <FormStatusMessage formStatus={errorPasswordMessage}/>
                        )}
                        <form onSubmit={handlePasswordSubmit} className="mt-3">
                            <div className="mb-2">
                                <input
                                    type="password"
                                    id="current_password"
                                    name="current_password"
                                    onChange={handleChange}
                                    value={passwordForm.current_password}
                                    placeholder="Password Actual"
                                    className="text-sm sm-500:text-base w-full p-3 rounded-lg bg-gray-900 text-white outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="mb-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    value={passwordForm.password}
                                    placeholder="Nuevo Password"
                                    className="text-sm sm-500:text-base w-full p-3 rounded-lg bg-gray-900 text-white outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    onChange={handleChange}
                                    value={passwordForm.password_confirmation}
                                    placeholder="Confirmar Password"
                                    className="text-sm sm-500:text-base w-full p-3 rounded-lg bg-gray-900 text-white outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                                    autoComplete="new-password"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`${isPasswordPending ? 'cursor-wait border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-gray-600' : 'cursor-pointer border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900'} text-sm sm-500:text-base w-full border-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300`}
                                disabled={isPasswordPending}
                            >
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserUpdate;
