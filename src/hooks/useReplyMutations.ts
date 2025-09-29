import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteReply, setCorrectReply, updateReply } from "../api/ReplyAPI";
import { useLocation } from "react-router-dom";
import { ActionState } from "../types";
import { Dispatch } from "react";
import { FormMessageStatus } from "../components/FormStatusMessage";
import { useAuthErrorHandler } from "./useAuthErrorHandler";
import { ApiErrorResponse } from "../types/errorResponseTypes";

export const useReplyMutations = (
    topicId: number, 
    updateActionState: (key: keyof ActionState, value: boolean) => void,
    setErrorMessage: Dispatch<React.SetStateAction<FormMessageStatus>>
) => {

    const queryClient = useQueryClient();
    const { pathname } = useLocation();
    const { handleAuthError } = useAuthErrorHandler();

    const handleError = (error: ApiErrorResponse, isToast: boolean) => {
        if (error.status === 401) {
            handleAuthError(pathname);
        } else {
            if (isToast) {
                toast.error(error.message || "Error inesperado.");
            } else {
                setErrorMessage({type: "error", message: error.message})
            }
            
        }
    };

    const refetchTopic = () => {
        queryClient.fetchQuery({ queryKey: ["topic", topicId.toString()] });
    };

    const mutateSolution = useMutation({
        mutationFn: setCorrectReply,
        onError: (error: ApiErrorResponse) => handleError(error, true),
        onSuccess: () => {
            toast.success("Solución cambiada!");
            refetchTopic();
        },
    });

    const mutateUpdate = useMutation({
        mutationFn: updateReply,
        onError: (error: ApiErrorResponse) => handleError(error, false),
        onSuccess: () => {
            toast.success("Respuesta actualizada!");
            refetchTopic();
            updateActionState('isEditing', false);
            setErrorMessage(null);
        },
    });

    const mutateDelete = useMutation({
        mutationFn: deleteReply,
        onError: (error: ApiErrorResponse) => handleError(error, true),
        onSuccess: () => {
            toast.success("Respuesta eliminada!");
            refetchTopic();
        },
    });

    return { mutateSolution, mutateUpdate, mutateDelete };
};
