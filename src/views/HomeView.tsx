import { useQuery } from "@tanstack/react-query";
import { getAllTopics } from "../api/TopicAPI";
import TopicCard from "../components/home/TopicCard";
import { useEffect } from "react";
import Pagination from "../components/Pagination";
import FilterBar from "../components/home/FilterBar";
import LoadingError from "../components/LoadingError";
import { FaceFrownIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import { usePagination } from "../hooks/usePagination";
import { PaginationInfo } from "../types";

function HomeView() {

    const {
        currentPage, setCurrentPage, 
        searchKeyword, setSearchKeyword, 
        selectedStatus, setSelectedStatus, 
        selectedCourseId, setSelectedCourseId
    } = usePagination();

    useEffect(() => window.scrollTo(0, 0), []);

    const { data: topics, isLoading: topicsLoading, isError: topicsError } = useQuery({
        queryKey: ['allTopics', currentPage - 1, searchKeyword, selectedStatus, selectedCourseId],
        queryFn: () => getAllTopics(currentPage - 1, searchKeyword, selectedStatus, selectedCourseId),
    });

    const paginationInfo: PaginationInfo = {
        number: topics?.number ?? 0,
        totalPages: topics?.totalPages ?? 0,
        totalElements: topics?.totalElements ?? 0,
        first: topics?.first ?? true, 
        last: topics?.last ?? true     
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen">

            {/* Filtro de búsqueda */}
            <FilterBar
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedCourseId={selectedCourseId}
                setSelectedCourseId={setSelectedCourseId}
                setCurrentPage={setCurrentPage}
            />


            {/* Temas populares */}
            <section className="py-8" id="paginated-section">
                <div className="max-w-[50rem] lg:max-w-[60rem] mx-auto px-4">
                    <div className="flex justify-between items-center mb-6 gap-2">
                        <h2 className="text-2xl sm-500:text-3xl font-semibold text-teal-400 leading-7 w-36 sm-500:w-auto">
                            Tópicos más recientes
                        </h2>
                        <Link
                            to="/topic/create"
                            className="flex items-center border-2 border-teal-400 hover:bg-teal-400 text-teal-400 hover:text-gray-900 pl-2 pr-3 py-2 rounded-lg text-xs sm-500:text-sm font-medium transition-colors duration-300"
                        >
                            <PlusIcon className="w-4 sm-500:w-5 mr-1" />
                            Crear Tópico
                        </Link>
                    </div>
                    
                    <LoadingError 
                        isLoading={topicsLoading} 
                        isError={topicsError} 
                        dataType="tópicos" 
                    />

                    {/* Verifica si hay contenido */}
                    {!topicsLoading && !topicsError && (
                        topics?.content?.length! > 0 ? (
                            <div className="space-y-8">
                                {topics?.content.map(topic => (
                                    <TopicCard topic={topic} key={topic.id} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 sm-500:py-24 text-gray-400">
                                <FaceFrownIcon className="w-14 sm-500:w-16 mb-2 sm-500:mb-4" />
                                <p className="text-base text-center sm-500:text-lg">No se encontraron resultados para los filtros aplicados.</p>
                            </div>
                        )
                    )}

                    <Pagination
                        currentPage={currentPage}
                        pagination={paginationInfo}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </section>
        </div>
    );
}

export default HomeView;
