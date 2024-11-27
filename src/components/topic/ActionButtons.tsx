import { CheckCircleIcon, CheckIcon, HandThumbUpIcon, PencilSquareIcon, TrashIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { ActionState } from "../../types";

type ActionButtonsProps = {
    actionStates: ActionState;
    isUpdatePending: boolean
    isDeletePending: boolean;
    handleUpdateClick: () => void;
    toggleIsEditing: () => void;
    toggleIsDeleting: () => void;
    isTopic?: boolean; 
    isSolutionPending?: boolean;
    isSolution?: boolean
    isFollowPending?: boolean;
    handleSolutionClick?: () => void;
    handleFollowClick?: () => void;
}

function ActionButtons({
    actionStates,
    isUpdatePending,
    isDeletePending,
    handleUpdateClick,
    toggleIsEditing,
    toggleIsDeleting,
    isTopic = false,
    isSolutionPending = false,
    isSolution = false,
    isFollowPending = false,
    handleSolutionClick,
    handleFollowClick,
} : ActionButtonsProps) {

    const isAuthorOrStaff = actionStates.isAuthor || actionStates.isStaffRole;

    return (
        <div className="flex items-start gap-2 ml-3">
            {!isTopic && actionStates.isStaffRole && !actionStates.isEditing && !actionStates.isDeleting && (
                <button
                    type="button"
                    onClick={handleSolutionClick}
                    className={`transition-colors ${isSolution ? 'text-teal-300 hover:text-gray-500' : ' text-gray-500 hover:text-teal-300' } ${isSolutionPending ? 'cursor-wait' : 'cursor-pointer'}`}
                    title={isSolution ? 'Desmarcar como solución' : 'Marcar como solución'}
                    disabled={isSolutionPending}
                >
                    <CheckCircleIcon className="w-5" />
                </button>
            )}

            {isTopic && !actionStates.isEditing && !actionStates.isDeleting && !actionStates.isAuthor &&(
                <button
                    type="button"
                    onClick={handleFollowClick}
                    className={`transition-colors ${actionStates.isFollower ? 'text-teal-300 hover:text-gray-500' : ' text-gray-500 hover:text-teal-300' } ${isFollowPending ? 'cursor-wait' : 'cursor-pointer'}`}
                    title={actionStates.isFollower ? 'Dejar de seguir tópico' : 'Seguir tópico'}
                    disabled={isFollowPending}
                >
                    <HandThumbUpIcon className="w-5" />
                </button>
            )}

            {isAuthorOrStaff && (
                <>
                    {!actionStates.isDeleting && (
                        <button
                            type="button"
                            onClick={actionStates.isEditing ? handleUpdateClick : toggleIsEditing}
                            className={` transition-colors ${isUpdatePending ? "cursor-wait text-gray-500 hover:text-gray-500" : "cursor-pointer text-teal-400 hover:text-teal-500"}`}
                            title={actionStates.isEditing ? 'Confirmar' : ( isTopic ? 'Editar tópico' : 'Editar respuesta' ) }
                            disabled={isUpdatePending || isSolutionPending}
                        >
                            {actionStates.isEditing ? (
                                <CheckIcon className={isTopic ? 'w-5' : 'w-4 sm-500:w-5'} />
                            ) : (
                                <PencilSquareIcon className={isTopic ? 'w-5' : 'w-4 sm-500:w-5'} />
                            )}
                        </button>
                    )}
                    
                    <button
                        type="button"
                        onClick={actionStates.isEditing ? toggleIsEditing : toggleIsDeleting}
                        className={`text-red-500 hover:text-red-600 transition-colors ${isDeletePending ? "cursor-wait" : "cursor-pointer"}`}
                        title={actionStates.isEditing || actionStates.isDeleting ? 'Salir' : ( isTopic ? "Eliminar tópico" : "Eliminar respuesta" )}
                        disabled={isUpdatePending || isSolutionPending || isDeletePending}
                    >
                        {actionStates.isEditing || actionStates.isDeleting ? (
                            <XCircleIcon className={isTopic ? 'w-5' : 'w-4 sm-500:w-5'} />
                        ) : (
                            <TrashIcon className={isTopic ? 'w-5' : 'w-4 sm-500:w-5'} />
                        )}
                    </button>
                </>
            )}
        </div>
    );
};

export default ActionButtons;
