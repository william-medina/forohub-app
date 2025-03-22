

type DeleteConfirmationProps = {
    isDeletePending: boolean
    handleDeleteClick: () => void;
    toggleIsDeleting: () => void;
    isTopic?: boolean
  };

function DeleteConfirmation({
    isDeletePending,
    handleDeleteClick,
    toggleIsDeleting,
    isTopic = false
} : DeleteConfirmationProps) {

    return (
        <div className="py-10 px-5 flex flex-col items-center gap-4 bg-gray-900 rounded-lg shadow-md">
            <p className="text-gray-100 text-base sm-500:text-lg text-center font-semibold">¿Desea eliminar {isTopic ? 'este tópico' : 'esta respuesta'}?</p>
            <div className="flex gap-4 justify-center">
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className={`${isDeletePending ? 'cursor-wait border-gray-500 text-gray-500 hover:bg-gray-900 hover:text-gray-500' : 'cursor-pointer border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900'} border-2 px-4 sm-500:px-5 py-2 rounded-lg text-xs sm-500:text-sm font-medium transition-colors duration-300`}
                    disabled={isDeletePending}
                >
                    Confirmar
                </button>
                <button
                    type="button"
                    onClick={toggleIsDeleting}
                    className="border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white px-4 sm-500:px-5 py-2 rounded-lg text-xs sm-500:text-sm font-medium cursor-pointer transition-colors duration-300"
                    disabled={isDeletePending}
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default DeleteConfirmation