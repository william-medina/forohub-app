import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { Status } from "../../types/topicTypes";
import { getCourses } from "../../api/CourseAPI";
import { useQuery } from "@tanstack/react-query";

interface FilterBarProps {
    searchKeyword: string;
    setSearchKeyword: (value: string) => void;
    selectedStatus: Status | null;
    setSelectedStatus: (value: Status | null) => void;
    selectedCourseId: number | null;
    setSelectedCourseId: (value: number | null) => void;
    setCurrentPage: (value: number) => void;
}

function FilterBar({
    searchKeyword,
    setSearchKeyword,
    selectedStatus,
    setSelectedStatus,
    selectedCourseId,
    setSelectedCourseId,
    setCurrentPage
}: FilterBarProps) {

    
    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    });

    const handleResetFilters = () => {
        setSearchKeyword("");
        setSelectedStatus(null);
        setSelectedCourseId(null);
        setCurrentPage(1);
    };

    return (
        <section className="pt-8 pb-2 sm-500:pb-8">
            <div className="max-w-[50rem] lg:max-w-[60rem] mx-auto px-4">
                <div className="flex gap-2 items-center mb-6">
                    <h2 className="text-2xl sm-500:text-3xl font-semibold text-teal-400">
                        Filtrar Tópicos
                    </h2>
                    <button
                        onClick={handleResetFilters}
                        className="flex items-center space-x-1 text-teal-400 hover:text-teal-300 transition-colors duration-300"
                    >
                        <ArrowPathIcon className="w-5 sm-500:w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm-500:gap-4 text-sm sm-500:text-base">
                    {/* Filtro por palabra clave */}
                    <div>
                        <label htmlFor="searchKeyword" className="block text-gray-400 mb-0.5 sm-500:mb-2">Buscar</label>
                        <input
                            id="searchKeyword"
                            type="text"
                            placeholder="Buscar por título"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors duration-300"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div>
                        <label htmlFor="status" className="block text-gray-400 mb-0.5 sm-500:mb-2">Estado</label>
                        <select
                            id="status"
                            value={selectedStatus ?? ""}
                            onChange={(e) => setSelectedStatus(e.target.value ? e.target.value as Status : null)}
                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-teal-400 transition-colors duration-300"
                        >
                            <option value="">Todos los estados</option>
                            <option value="ACTIVE">{'Activo (En progreso)'}</option>
                            <option value="CLOSED">{'Cerrado (Resueltos)'}</option>
                        </select>
                    </div>

                    {/* Filtro por curso */}
                    <div>
                        <label htmlFor="course" className="block text-gray-400 mb-0.5 sm-500:mb-2">Curso</label>
                        <select
                            id="course"
                            value={selectedCourseId ?? ""}
                            onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-teal-400 transition-colors duration-300"
                        >
                            <option value="">Todos los cursos</option>
                            {courses?.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FilterBar;
