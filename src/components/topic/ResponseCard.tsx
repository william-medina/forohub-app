import { CheckCircleIcon } from "@heroicons/react/16/solid"
import { formatRelativeDate } from "../../utils"
import { Response } from "../../types/responseTypes"
import { useAuthStore } from "../../stores/useAuthStore"
import { useEffect, useRef, useState } from "react"
import { Topic } from "../../types/topicTypes"
import FormStatusMessage, { FormMessageStatus } from "../FormStatusMessage"
import { useResponseMutations } from "../../hooks/useResponseMutations"
import { ActionState } from "../../types"
import ActionButtons from "./ActionButtons"
import DeleteConfirmation from "./DeleteConfirmation"
import AuthorInfo from "./AuthorInfo"

type ResponseCardProps = {
    response: Response
    topicId: Topic['id']
}

function ResponseCard({response, topicId} : ResponseCardProps) {

    const [actionStates, setActionStates] = useState<ActionState>({
        isAuthor: false,
        isStaffRole: false,
        isEditing: false,
        isDeleting: false,
        isFollower: false
    });

    const updateActionState = (key: keyof ActionState, value: boolean) => {
        setActionStates(prevState => ({ ...prevState, [key]: value }));
    };

    const [content, setContent] = useState(response.content);
    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);

    const { userData, } = useAuthStore();
    const { mutateSolution, mutateUpdate, mutateDelete } = useResponseMutations(topicId, updateActionState, setErrorMessage);
    
    const [rows, setRows] = useState(4);
    const divRef = useRef<HTMLDivElement | null>(null);
    

    useEffect(() => {
        if (divRef.current) {
            const divHeight = divRef.current.getBoundingClientRect().height;
            setRows(Math.ceil(divHeight / 20));
        }
    }, [actionStates.isEditing]);

    useEffect(() => {
        if(userData) {
            updateActionState('isAuthor', response.author.username === userData.username);
            updateActionState('isStaffRole', userData.profile !== "USER");
        }
    }, [userData])


    const handleSolutionClick = () => mutateSolution.mutate(response.id);
    const toggleIsEditing = () => { 
        updateActionState('isEditing', !actionStates.isEditing); 
        setContent(response.content);
        setErrorMessage(null);
    }
    const handleUpdateClick = () => mutateUpdate.mutate({ responseId: response.id, formData: {content} });
    const toggleIsDeleting = () => updateActionState('isDeleting',!actionStates.isDeleting);
    const handleDeleteClick = () => mutateDelete.mutate(response.id);

    return (
        <div
            className={`p-5 rounded-lg shadow-md space-y-5 ${
                actionStates.isDeleting ? "bg-red-900" : (response.solution ? "bg-teal-900" : "bg-gray-800")}
            }`}
        >
            <div className="flex flex-col items-start">
                <div className="flex justify-between w-full">

                    { /* Verifica si la respuesta está marcada como solución y muestra el icono correspondiente */ }
                    <div>
                        {response.solution &&(
                            <div className="flex items-center text-teal-400 gap-1">
                                <CheckCircleIcon className="w-4 sm-500:w-5" title="Respuesta marcada como solución" />
                                <p className="font-bold text-base sm-500:text-lg">Solución</p>
                            </div> 
                        )}
                        <div className="text-xs sm-500:text-sm text-gray-400">
                            <span>Publicado </span>
                            {formatRelativeDate(new Date(response.createdAt))}, el {new Date(response.createdAt).toLocaleDateString("es-ES")}
                        </div> 
                    </div>

                    {/* Muestra los botones de acción (editar, eliminar) solo si el usuario es el autor o tiene rol de staff */}
                    { userData && (
                        <ActionButtons
                            actionStates={actionStates}
                            isUpdatePending={mutateUpdate.isPending}
                            isDeletePending={mutateDelete.isPending}
                            handleUpdateClick={handleUpdateClick}
                            toggleIsEditing={toggleIsEditing}
                            toggleIsDeleting={toggleIsDeleting}
                            isSolutionPending={mutateSolution.isPending}
                            isSolution={response.solution}
                            handleSolutionClick={handleSolutionClick}
                        />
                    )}
                </div>
            </div>


            {/* Modo eliminar: Muestra el componente de confirmación de eliminación si se está intentando eliminar */}
            { actionStates.isDeleting && (
                <DeleteConfirmation
                    isDeletePending={mutateDelete.isPending}
                    handleDeleteClick={handleDeleteClick}
                    toggleIsDeleting={toggleIsDeleting}
                />
            )}

            {/* Modo editar: Muestra un textarea si el usuario está en modo edición */}
            { actionStates.isEditing ? (
                <div>
                    {errorMessage && (
                        <FormStatusMessage formStatus={errorMessage}/>
                    )}
                    <textarea
                        id={`content-${response.id}`}
                        name="content"
                        rows={rows}
                        className="w-full mt-2 p-3 text-sm sm-500:text-base bg-gray-900 text-gray-100 leading-4 sm-500:leading-5 rounded-md focus:outline-none"
                        placeholder="Escribe tu respuesta actualizada aquí..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>  
            ) : (
                <div ref={divRef} className="py-5 leading-4 sm-500:leading-5 text-gray-100 text-sm sm-500:text-base">
                    {content}
                </div>
            )}

            {/* Información del autor y fecha de la respuesta */}
            <AuthorInfo 
                isAuthor={actionStates.isAuthor}
                author={response.author}
                updatedAt={response.updatedAt}
            />
            
        </div>
    )
}

export default ResponseCard