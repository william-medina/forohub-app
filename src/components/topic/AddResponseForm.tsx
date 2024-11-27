import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addResponse } from "../../api/ResponseAPI";
import FormStatusMessage, { FormMessageStatus } from "../FormStatusMessage";
import { useState } from "react";
import { CreateResponseForm } from "../../types/responseTypes";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useAuthErrorHandler } from "../../hooks/useAuthErrorHandler";

type AddResponseFormProps = {
    topicId: number
}

function AddResponseForm({topicId} : AddResponseFormProps) {

    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);

    const { pathname } = useLocation();
    const { handleAuthError } = useAuthErrorHandler();

    const initialData: CreateResponseForm = {
        topicId,
        content: ""
    }

    const [responseData, setResponseData] = useState<CreateResponseForm>(initialData);

    const { mutate, isPending } = useMutation({
        mutationFn: addResponse,
        onError: (error) => {
            if(error.message === "Unauthorized") {
                handleAuthError(pathname);
            } else {
                setErrorMessage({type: 'error', message:  error.message || "Error inesperado. Intenta nuevamente."});
            }
        },
        onSuccess: () => {
            setResponseData(initialData);
            setErrorMessage(null);
            toast.success('Respuesta agregada!');
            queryClient.fetchQuery({ queryKey: ["topic", topicId.toString()] });
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(responseData)
    };

    return (
        <div className="mt-14 max-w-[50rem] lg:max-w-[60rem] px-4 mx-auto">
             {errorMessage && (
                <FormStatusMessage formStatus={errorMessage}/>
            )}
            <h3 className="text-lg mt-2 sm-500:text-xl font-semibold text-teal-400 mb-2">Agregar una respuesta</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="content" className="block text-gray-300 text-xs sm-500:text-sm font-semibold my-1">Tu respuesta:</label>
                    <textarea
                        id="content"
                        name="content"
                        rows={5}
                        className="w-full p-3 mt-2 text-sm sm-500:text-base bg-gray-800 text-white border border-gray-800 rounded-md focus:outline-none"
                        placeholder="Escribe tu respuesta aquí..."
                        value={responseData.content}
                        onChange={(e) => setResponseData({...responseData, content: e.target.value})}
                    ></textarea>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className={`${isPending ? 'cursor-wait border-gray-600 text-gray-600 hover:bg-gray-900 hover:text-gray-600' : 'cursor-pointer border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900'} px-4 py-2 border-2 text-sm sm-500:text-base font-semibold rounded-md duration-300`}
                        disabled={isPending}
                    >
                        Publicar Respuesta
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddResponseForm