import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionState } from "../types";
import { Dispatch } from "react";
import { FormMessageStatus } from "../components/FormStatusMessage";
import { deleteTopic, toggleFollowTopic, updateTopic } from "../api/TopicAPI";
import { useAuthErrorHandler } from "./useAuthErrorHandler";
import { ApiErrorResponse } from "../types/errorResponseTypes";

export const useTopicMutations = (
    topicId: number, 
    updateActionState: (key: keyof ActionState, value: boolean) => void,
    setErrorMessage: Dispatch<React.SetStateAction<FormMessageStatus>>
) => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
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

    const mutateUpdate = useMutation({
        mutationFn: updateTopic,
        onError: (error: ApiErrorResponse) => handleError(error, false),
        onSuccess: () => {
            toast.success("Tópico actualizado!");
            refetchTopic();
            updateActionState('isEditing', false);
            setErrorMessage(null);
        },
    });

    const mutateDelete = useMutation({
        mutationFn: deleteTopic,
        onError: (error: ApiErrorResponse) => handleError(error, true),
        onSuccess: () => {
            toast.success("Tópico eliminado!");
            navigate('/');
        },
    });


    
    const mutateFollow = useMutation({
        mutationFn: toggleFollowTopic,
        onError: (error: ApiErrorResponse) => handleError(error, false),
        onSuccess: (data) => {
            if (data?.followedAt) {
                toast.success("Ahora sigues este tópico.");
            } else {
                toast.success("Has dejado de seguir el tópico.");
            }
            
            refetchTopic();
        },
    });


    return { mutateUpdate, mutateDelete, mutateFollow };
};
