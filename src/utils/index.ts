import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Profile } from '../types';
import { AxiosError } from 'axios';

export const formatRelativeDate = (date: Date): string => {
    return formatDistanceToNow(date, { addSuffix: true, locale: es }).replace('alrededor de ', '');
}

export const formatResponsesCount = (count: number): string => {
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

export function handleAxiosError(error: unknown) {

    if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data.error);
    }
   
    throw new Error("No se pudo conectar con el servidor. Intenta nuevamente más tarde.");
}