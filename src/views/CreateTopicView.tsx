import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { getCourses } from "../api/CourseAPI";
import { useAuthStore } from "../stores/useAuthStore";
import FormStatusMessage, { FormMessageStatus } from "../components/FormStatusMessage";
import { TopicForm } from "../types/topicTypes";
import { createTopic } from "../api/TopicAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthErrorHandler } from "../hooks/useAuthErrorHandler";

function CreateTopicView() {

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { userData } = useAuthStore();
    const { handleAuthError } = useAuthErrorHandler();

    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);

    const initialData: TopicForm = {
        title: "",
        description: "",
        courseId: null
    }

    const [topicData, setTopicData] = useState<TopicForm>(initialData);

    useEffect(() => window.scrollTo(0, 0), []);

    const { data: courses } = useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createTopic,
        onError: (error) => {
            if(error.message === "Unauthorized") {
                handleAuthError(pathname);
            } else {
                setErrorMessage({type: 'error', message:  error.message || "Error inesperado. Intenta nuevamente."});
            }
        },
        onSuccess: (data) => {
            setTopicData(initialData);
            setErrorMessage(null);
            toast.success('Tópico creado!');
            navigate(`/topic/${data?.id}`)
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(topicData);
    };

    const handleChange = (e : ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTopicData({
            ...topicData,
            [name] : value
        })
    }

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center py-10">
            <div className="max-w-[40rem] w-full px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm-500:text-3xl font-bold text-teal-400 mb-8 text-center">
                    Crear Tópico
                </h1>

                {/* Información del creador */}
                <div className="flex items-center justify-start bg-gray-800 p-3 sm-500:p-4 rounded-lg mb-3 sm-500:mb-5 shadow-md gap-2 text-sm sm-500:text-base">
                    <p className=" text-gray-400">Creado por:</p>
                    <p className=" font-semibold text-teal-400">{userData && userData.username}</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md space-y-3 sm-500:space-y-5 text-sm sm-500:text-base"
                >
                    {errorMessage && (
                        <FormStatusMessage formStatus={errorMessage}/>
                    )}
                    {/* Campo Título */}
                    <div>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={topicData.title}
                            onChange={handleChange}
                            placeholder="Escribe el título del tópico"
                            className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Campo Descripción */}
                    <div>
                        <textarea
                            id="description"
                            name="description"
                            value={topicData.description}
                            onChange={handleChange}
                            placeholder="Escribe una breve descripción del tópico"
                            rows={4}
                            className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        ></textarea>
                    </div>

                    {/* Selección de Curso */}
                    <div>
                        <select
                            id="course"
                            name="courseId"
                            value={topicData.courseId || ""}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-900 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            <option value="">Selecciona el curso</option>
                            {courses &&
                                courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className={`${isPending ? 'cursor-wait border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-gray-600' : 'cursor-pointer border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900'} w-full py-3 border-2 font-semibold rounded-md focus:outline-none shadow-lg transition-all duration-300`}
                        disabled={isPending}
                    >
                        Crear Tópico
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateTopicView;
