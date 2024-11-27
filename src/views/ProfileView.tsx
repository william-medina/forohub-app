import { CheckCircleIcon, FaceFrownIcon, PlusCircleIcon, PlusIcon } from '@heroicons/react/16/solid';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserUpdate from '../components/profile/UserUpdate';
import { useQuery } from '@tanstack/react-query';
import { getAllTopicsByUser, getFollowedTopicsByUser } from '../api/TopicAPI';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import { PaginationInfo } from '../types';
import LoadingError from '../components/LoadingError';
import { formatResponsesCount } from '../utils';
import { getUserStats } from '../api/AuthAPI';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

function ProfileView() {
    
    const navigate = useNavigate();

    const {
        currentPage, setCurrentPage, 
        searchKeyword, setSearchKeyword, 
        selectedTopicType, setSelectedTopicType
    } = usePagination();

    useEffect(() => window.scrollTo(0, 0), []);

    const { data: topicsCreated, isLoading: topicsCreatedLoading, isError: topicsCreatedError } = useQuery({
        queryKey: ['allTopicsCreatedByUser', currentPage - 1, searchKeyword ],
        queryFn: () => getAllTopicsByUser(currentPage - 1, searchKeyword),
        enabled: selectedTopicType === 'created'
    });

    const { data: topicsFollowed, isLoading: topicsFollowedLoading, isError: topicsFollowedError } = useQuery({
        queryKey: ['allTopicsFollowedByUser', currentPage - 1, searchKeyword ],
        queryFn: () => getFollowedTopicsByUser(currentPage - 1, searchKeyword),
        enabled: selectedTopicType === 'followed'
    });

    const topics = selectedTopicType === 'created' ? topicsCreated : topicsFollowed;
    const topicsContent = selectedTopicType === 'created' ? topicsCreated?.content : topicsFollowed?.content.map(topic => topic.topic);

    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: getUserStats,
    });

    const paginationInfo: PaginationInfo = {
        number: topics?.number ?? 0,
        totalPages: topics?.totalPages ?? 0,
        totalElements: topics?.totalElements ?? 0,
        first: topics?.first ?? true, 
        last: topics?.last ?? true     
    };

    return (
        <section className="max-w-[50rem] lg:max-w-[60rem] py-6 mx-auto px-4 text-white">
            
            <h2 className="text-2xl sm-500:text-3xl text-teal-400 text-center font-bold mb-8 mt-4">Bienvenido a tu Perfil</h2>
            

            {/* Estadísticas del Usuario */}
            <div className="grid grid-cols-1 sm-500:grid-cols-3 gap-3 sm-500:gap-6 mb-3 sm-500:mb-6">
                <div className="bg-gray-800 rounded-lg p-3 sm-500:p-4 text-center flex flex-col justify-between">
                    <h3 className="leading-5 text-base sm-500:text-[1.125rem] font-semibold text-teal-400">Tópicos Realizados</h3>
                    <p className="text-3xl sm-500:text-4xl font-bold mt-2">{stats?.topicsCount || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 sm-500:p-4 text-center flex flex-col justify-between">
                    <h3 className="leading-5 text-base sm-500:text-[1.125rem] font-semibold text-teal-400">Respuestas Realizadas</h3>
                    <p className="text-3xl sm-500:text-4xl font-bold mt-2">{stats?.responsesCount}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 sm-500:p-4 text-center flex flex-col justify-between">
                    <h3 className="leading-5 text-base sm-500:text-[1.125rem] font-semibold text-teal-400">Tópicos Siguiendo</h3>
                    <p className="text-3xl sm-500:text-4xl font-bold mt-2">{stats?.followedTopicsCount}</p>
                </div>
            </div>

            {/* Configuración de Usuario */}
            <UserUpdate />

            {/* Seleccion tipo de topics */}
            <div className="flex space-x-3 sm-500:space-x-4 mb-2 sm-500:mb-3 leading-4 text-sm sm-500:text-base">
                <button
                    onClick={() => setSelectedTopicType('created')}
                    className={`py-2 px-3 sm-500:px-4 rounded-lg ${
                        selectedTopicType === 'created' ? 'bg-teal-400 text-gray-900' : 'bg-gray-700 text-gray-300'
                    }`}
                >
                    Tus Tópicos
                </button>
                <button
                    onClick={() => setSelectedTopicType('followed')}
                    className={`py-2 px-3 sm-500:px-4 rounded-lg ${
                        selectedTopicType === 'followed' ? 'bg-teal-400 text-gray-900' : 'bg-gray-700 text-gray-300'
                    }`}
                >
                    Tópicos Seguidos
                </button>
            </div>

            {/* Tópicos */}
            <div id='paginated-section' className="bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col sm-500:flex-row text-start gap-4 sm-500:items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-xl sm-500:text-2xl font-bold text-teal-400">
                            {selectedTopicType === 'created' ? 'Tus Tópicos' : 'Tópicos Seguidos'}
                        </h3>
                        {selectedTopicType === 'created' && (
                            <PlusCircleIcon
                                onClick={() => navigate('/topic/create')}
                                className="w-6 sm-500:w-7 text-teal-400 cursor-pointer hover:text-teal-500 transition-colors duration-300"
                            />
                        )}
                     </div>
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Buscar..."
                        className="text-sm sm-500:text-base p-2 rounded-lg bg-gray-900 text-white outline-none  focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                
                <LoadingError 
                    isLoading={selectedTopicType === 'created' ? topicsCreatedLoading : topicsFollowedLoading} 
                    isError={selectedTopicType === 'created' ? topicsCreatedError : topicsFollowedError} 
                    dataType="tópicos" 
                />

                {!topicsCreatedLoading && !topicsFollowedLoading && !topicsCreatedError && !topicsFollowedError && (
                    topicsContent?.length! > 0 ? (
                        <div className="mb-4">
                            {topicsContent?.map((topic) => (
                                <div key={topic.id} className="py-4 border-b-2 border-gray-700 space-y-1">
                                    <div className="flex items-center">
                                        <Link to={`/topic/${topic.id}`}>
                                            <h4 className="text-base sm-500:text-lg leading-5 font-medium hover:text-teal-400 duration-300">
                                                {topic.title}
                                            </h4>
                                        </Link>
                                        <div className="ml-2 flex items-center">
                                            <CheckCircleIcon
                                                className={`w-4 sm-500:w-5 ${
                                                    topic.status === 'ACTIVE' ? 'text-gray-500' : 'text-teal-300'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs sm-500:text-sm text-gray-400">{formatResponsesCount(topic.responsesCount)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchKeyword !== "" ? (
                            <div className="flex flex-col items-center justify-center py-20 sm-500:py-24 text-gray-400">
                                <FaceFrownIcon className="w-14 sm-500:w-16 mb-2 sm-500:mb-4" />
                                <p className="text-base text-center sm-500:text-lg">No se encontraron resultados para la palabra ingresada.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 sm-500:py-24 text-gray-400">
                                <InformationCircleIcon className="w-10 sm-500:w-12 mb-2 sm-500:mb-3" />
                                <p className="text-base leading-5 text-center sm-500:text-lg">
                                    {selectedTopicType === "created" ? 'Aún no has creado ningún tópico.' : 'Aún no estás siguiendo ningún tópico.'}
                                </p>
                                {selectedTopicType === "created" && (
                                    <Link
                                        to="/topic/create"
                                        className="flex items-center border-2 mt-4 border-teal-400 hover:bg-teal-400 text-teal-400 hover:text-gray-900 pl-2 pr-3 py-2 rounded-lg text-xs sm-500:text-sm font-medium transition-colors duration-300"
                                    >
                                        <PlusIcon className="w-4 sm-500:w-5 mr-1" />
                                        Crear Tópico
                                    </Link>
                                )}
                            </div>
                        )
                    )
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                pagination={paginationInfo}
                setCurrentPage={setCurrentPage}
            />
        </section>
    );
}

export default ProfileView;
