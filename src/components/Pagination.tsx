import { useEffect } from "react";
import { PaginationInfo } from "../types";

type PaginationProps = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pagination: PaginationInfo;
};

function Pagination({
    currentPage,
    setCurrentPage,
    pagination,
}: PaginationProps) {

    useEffect(() => {
        const section = document.getElementById("paginated-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

    }, [currentPage]);

    const handlePrevious = () => {
        if (!pagination.first) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (!pagination.last) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="flex justify-between items-center mt-6 text-white text-sm sm-500:text-base">
            <button
                onClick={handlePrevious}
                disabled={pagination.first}
                className="px-2 sm-500:px-4 py-2 bg-teal-400 border-teal-400 border-2 text-gray-900 rounded-md hover:bg-teal-500 hover:border-teal-500  disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-800 transition-colors duration-300"
            >
                Anterior
            </button>
            <span className={`text-xs sm-500:text-sm ${pagination.totalPages === 0 ? 'text-gray-500' : 'text-teal-400'}`}>
                Página {pagination.totalPages === 0 ? 0 : currentPage} de {pagination.totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={pagination.last}
                className="px-2 sm-500:px-4 py-2 bg-teal-400 border-teal-400 border-2 text-gray-900 rounded-md hover:bg-teal-500 hover:border-teal-500  disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-800 transition-colors duration-300"
            >
                Siguiente
            </button>
        </div>
    );
}

export default Pagination;
