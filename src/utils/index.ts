import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Profile } from '../types';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/errorResponseTypes';

export const formatRelativeDate = (date: Date): string => {
    return formatDistanceToNow(date, { addSuffix: true, locale: es }).replace('alrededor de ', '');
}

export const formatRepliesCount = (count: number): string => {
    return `${count} ${count === 1 ? 'respuesta' : 'respuestas'}`;
}

export const formatProfile = (profile: Profile): string => {
    const profileLabels: Record<Profile, string> = {
        ADMIN: " ✦ Admin",
        MODERATOR: " ✦ Moderador",
        INSTRUCTOR: " ✦ Instructor",
        USER: ""
    };

    return profileLabels[profile] ?? "";
};

export function handleAxiosError(error: unknown): never {

    // El error proviene de Axios y contiene una respuesta del servidor.
    if (error instanceof AxiosError && error.response) {
        const data = error.response.data as ApiErrorResponse;

        throw {
            message: data.message || "Error inesperado.",
            status: data.status,
            error: data.error,
            errors: data.errors ?? null,
            path: data.path,
            timestamp: data.timestamp,
        } as ApiErrorResponse;
    }

    // El error ya corresponde a un objeto con la estructura de ApiErrorResponse.
    if (typeof error === "object" && error !== null && "status" in error && "message" in error) {
        throw error as ApiErrorResponse;
    }

    //Error de red o situación no contemplada; se devuelve una respuesta estándar.
    throw {
        message: "No se pudo conectar con el servidor. Intenta nuevamente más tarde.",
        status: 500,
        error: "NETWORK_ERROR",
        path: "",
        timestamp: new Date().toISOString(),
    } as ApiErrorResponse;
}