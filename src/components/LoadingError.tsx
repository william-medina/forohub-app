
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type LoadingErrorProps = {
    isLoading: boolean;
    isError: boolean;
    dataType: string;
}


function LoadingError({isLoading, isError, dataType} : LoadingErrorProps) {
    if (isLoading) {
        return (
			<div className="flex justify-center items-center py-20 sm-500:py-24">
				<div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin"></div>
			</div>
        );
    }
    
    if (isError) {
        return (
			<div className="flex justify-center items-center text-red-500 py-20 sm-500:py-24 text-sm sm-500:text-base">
				<ExclamationCircleIcon className="w-6 sm-500:w-8 mr-1 sm-500:mr-2" />
				<span>Error al cargar {dataType}.</span>
			</div>
        );
    }
    
    return null;
}

export default LoadingError