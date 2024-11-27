import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { getTopicById } from "../api/TopicAPI";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { formatRelativeDate } from "../utils";
import AddResponseForm from "../components/topic/AddResponseForm";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ResponseCard from "../components/topic/ResponseCard";
import { useAuthStore } from "../stores/useAuthStore";
import FormStatusMessage, { FormMessageStatus } from "../components/FormStatusMessage";
import { TopicForm } from "../types/topicTypes";
import { getCourses } from "../api/CourseAPI";
import { useTopicMutations } from "../hooks/useTopicMutations";
import { ActionState } from "../types";
import ActionButtons from "../components/topic/ActionButtons";
import AuthorInfo from "../components/topic/AuthorInfo";
import DeleteConfirmation from "../components/topic/DeleteConfirmation";

function TopicView() {

    const [actionStates, setActionStates] = useState<ActionState>({
        isAuthor: false,
        isStaffRole: false,
        isEditing: false,
        isDeleting: false,
        isFollower: false,
    });

    const updateActionState = (key: keyof ActionState, value: boolean) => {
        setActionStates(prevState => ({ ...prevState, [key]: value }));
    };

    const { pathname } = useLocation();
    const { topicId } = useParams(); 

    const { userData, setLastVisitedURL } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);

    const [rowsTitle, setRowsTitle] = useState(1);
    const [rowsDescription, setRowsDescription] = useState(4);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const descriptionRef = useRef<HTMLDivElement | null>(null);

    const { mutateUpdate, mutateDelete, mutateFollow } = useTopicMutations(topicId ? parseInt(topicId) : 0, updateActionState, setErrorMessage);

    const { data: topic, isLoading, isError, error } = useQuery({
        queryKey: ["topic", topicId],
        queryFn: () => getTopicById(Number(topicId)),
    });

    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    });

    const initialData: TopicForm = {
        title: topic?.title || "",
        description: topic?.description || "",
        courseId: topic?.course.id || null
    }

    const [topicData, setTopicData] = useState<TopicForm>(initialData);
    
    useEffect(() => window.scrollTo(0, 0), []);
    
    useEffect(() => {
        if(topic && userData) {
            updateActionState('isAuthor', topic.author.username === userData.username);
            updateActionState('isStaffRole', userData.profile !== "USER");

            const isFollowed = topic.followers.some(follower => follower.user.username === userData.username);
            updateActionState('isFollower', isFollowed);
        }
    }, [topic, userData])

    useEffect(() => {
        if (descriptionRef.current) {
            const divHeight = descriptionRef.current.getBoundingClientRect().height; 
            const lineHeight = 20;
            const calculatedRows = Math.ceil(divHeight / lineHeight);
            setRowsDescription(calculatedRows < 4 ? 4 : calculatedRows);
        }
        if (titleRef.current) {
            const divHeight = titleRef.current.getBoundingClientRect().height; 
            const lineHeight = 30;
            const calculatedRows = Math.ceil(divHeight / lineHeight);
            setRowsTitle(calculatedRows);
        }
    }, [actionStates.isEditing, descriptionRef.current]);


    const toggleIsEditing = () => { 
        updateActionState('isEditing', !actionStates.isEditing); 
        setTopicData(initialData);
        setErrorMessage(null);
    }
    
    const handleUpdateClick = () => {
        const updatedTopic = { topicId: topic?.id || 0, formData: topicData };
        mutateUpdate.mutate(updatedTopic)
    }

    const toggleIsDeleting = () => updateActionState('isDeleting', !actionStates.isDeleting);
    const handleDeleteClick = () => mutateDelete.mutate(topic?.id || 0);

    const handleFollowClick = () => mutateFollow.mutate(topic?.id || 0);

    const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTopicData({
            ...topicData,
            [name] : value
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <div className="w-12 sm-500:w-16 h-12 sm-500:h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin" />
            </div>
        );
    }
    if (isError || !topic) {
        return (
            (error?.message && error?.message === "Tópico no encontrado") ? (
                <div className="flex flex-col justify-center items-center text-center h-[90vh] text-white px-6 py-4">
                    <div className="max-w-2xl">
                        <div className="w-full flex justify-center">
                            <ExclamationCircleIcon className="w-12 sm-500:w-16 text-teal-400 mb-4" />
                        </div>
                        
                        <h2 className=" leading-5 text-xl sm-500:text-2xl font-semibold text-white mb-4">
                            Lo sentimos, el tópico que buscas no está disponible
                        </h2>

                        <p className="leading-4 text-sm sm-500:text-base text-gray-300 mb-6 text-center">
                            Puede que el tópico haya sido movido, eliminado o nunca haya existido. 
                            Por favor, verifica la URL o regresa a la página principal para explorar otros tópicos.
                        </p>

                        <Link to="/" className="text-sm sm-500:text-base px-4 py-2 bg-teal-400 text-gray-900 rounded-md hover:bg-teal-500 transition duration-200">
                            Volver al inicio
                        </Link>
                    </div>
                    
                </div>
            ) : (
                <div className="flex justify-center items-center h-[90vh] text-red-500 px-6 py-4">
                    <ExclamationCircleIcon className="w-8 sm:w-10 mr-2 text-red-500" />
                    <span className="text-lg sm:text-xl">Error al cargar el tópico.</span>
                </div>
            )
                
        );
    }

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-[50rem] lg:max-w-[60rem] mx-auto px-4 space-y-6">
                {errorMessage && (
                    <FormStatusMessage formStatus={errorMessage}/>
                )}
                <section className={`${actionStates.isDeleting ? 'bg-red-900' : 'bg-gray-800'}  p-6 rounded-lg shadow-md`}>
                    <div className="flex justify-between items-start w-full">
                        <div className="flex-1">
                            {/* Estado del tópico */}
                            {topic.status === "CLOSED" && (
                                <div className="flex items-center gap-1 border-teal-400 border-2 px-3 py-2 mb-4 rounded w-fit">
                                    <CheckCircleIcon className="w-4 sm-500:w-5 text-teal-400" title="Tópico marcado como solucionado" />
                                    <p className="text-teal-400 font-bold text-sm sm-500:text-base">Solucionado</p>
                                </div>
                            )}

                            {/* Título del tópico */}
                            { actionStates.isEditing ? (
                                <textarea
                                    id="title"
                                    name="title"
                                    rows={rowsTitle}
                                    className="w-full p-3 bg-gray-900 leading-6 text-[1.25rem] sm-500:text-[1.5rem] font-bold placeholder:font-normal placeholder:text-sm sm-500:placeholder:text-base placeholder:leading-4 sm-500:placeholder:leading-5 text-teal-400 rounded-md focus:outline-none"
                                    placeholder="Escribe tu título actualizado aquí..."
                                    value={topicData.title}
                                    onChange={handleChange}
                                ></textarea>
                            ) : (
                                <div ref={titleRef} className="leading-6 text-[1.25rem] sm-500:text-[1.5rem] font-bold text-teal-400 mb-1">
                                    {topic.title}
                                </div>
                            )}
                        </div>
                       
                        {/* Iconos de editar y eliminar */}
                            {userData && (
                                <ActionButtons
                                actionStates={actionStates}
                                isUpdatePending={mutateUpdate.isPending}
                                isDeletePending={mutateDelete.isPending}
                                isFollowPending={mutateFollow.isPending}
                                handleUpdateClick={handleUpdateClick}
                                handleFollowClick={handleFollowClick}
                                toggleIsEditing={toggleIsEditing}
                                toggleIsDeleting={toggleIsDeleting}
                                isTopic={true}
                            />
                        )}

                    </div>                    

                    {/* Fecha de publicación */}
                    <div className="text-xs sm-500:text-sm text-gray-400 mb-1">
                        <span>Publicado </span>
                        {formatRelativeDate(new Date(topic.createdAt))}, el {new Date(topic.createdAt).toLocaleDateString("es-ES")}
                    </div>

                    {/* Categoría del curso */}
                    <span className="inline-block text-teal-300 bg-gray-700 px-2 py-1 text-xs sm-500:text-sm rounded w-fit">
                        {topic.course.category}
                    </span>

                     {/* Modo eliminar: Muestra el componente de confirmación de eliminación si se está intentando eliminar */}
                     { actionStates.isDeleting && (
                        <div className="my-5">
                            <DeleteConfirmation
                                isDeletePending={mutateDelete.isPending}
                                handleDeleteClick={handleDeleteClick}
                                toggleIsDeleting={toggleIsDeleting}
                            />
                        </div>
                    )}

                    {/* Descripción del tópico */}
                    { actionStates.isEditing ? (
                        <textarea
                            id="description"
                            name="description"
                            rows={rowsDescription}
                            className="w-full mt-4 mb-3 p-3 text-sm sm-500:text-base bg-gray-900 text-gray-100 leading-4 sm-500:leading-5 rounded-md focus:outline-none"
                            placeholder="Escribe tu descripción actualizada aquí..."
                            value={topicData.description}
                            onChange={handleChange}
                        ></textarea>
                    ) : (
                        <div ref={descriptionRef} className="text-gray-100 mb-12 mt-10 leading-4 sm-500:leading-5 text-sm sm-500:text-base">
                            {topic.description}
                        </div>
                    )}
                    

                    {/* Información del curso */}
                    { actionStates.isEditing ? (
                        <div className="text-xs sm-500:text-sm text-gray-400 mb-3 leading-3 sm-500:leading-4 flex items-center">
                            <span className="font-bold">Curso: </span>
                            <select
                                id="course"
                                name="courseId"
                                value={topicData.courseId ?? ""}
                                onChange={handleChange}
                                className="w-full p-[0.4rem] ml-2 text-gray-100 bg-gray-900 rounded-md shadow-md outline-none"
                            >
                                {courses?.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="text-xs sm-500:text-sm text-gray-400 mb-2 leading-3 sm-500:leading-4">
                            <span className="font-bold">Curso: </span>
                            {topic.course.name}
                        </div>
                    )}
                    

                    {/* Información del autor y fecha de la respuesta */}
                    <AuthorInfo 
                        isAuthor={actionStates.isAuthor}
                        author={topic.author}
                        updatedAt={topic.updateAt}
                    />

                </section>


                {/* Respuestas */}
                <section className="space-y-4">
                    <h2 className="text-lg sm-500:text-xl font-semibold text-teal-400">Respuestas ({topic.responses.length})</h2>
                    {topic.responses.map(response => (
                        <ResponseCard response={response} topicId={parseInt(topicId!)} key={response.id} />
                    ))}
                </section>
            </div>

            {/* Formulario para agregar una nueva respuesta */}
            {userData ? (
                <AddResponseForm topicId={parseInt(topicId!)} />
            ) : (
                <div className="p-4 text-gray-100 rounded-lg text-center mt-10">
                    <p className="text-sm sm-500:text-base">
                        Debes <Link to="/login" onClick={() => setLastVisitedURL(pathname)} className="font-bold text-teal-400">iniciar sesión</Link> para poder publicar una respuesta.
                    </p>
                </div>
            )}
            
        </div>
    );
}

export default TopicView