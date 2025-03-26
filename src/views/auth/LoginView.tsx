import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginForm } from "../../types/userTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticateUser } from "../../api/AuthAPI";
import { useAuthStore } from "../../stores/useAuthStore";
import FormWrapper from "../../components/FormWrapper";
import { FormMessageStatus } from "../../components/FormStatusMessage";

function LoginView() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { lastVisitedURL, setIsAuthenticated } = useAuthStore();

    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);
    const [formData, setFormData] = useState<UserLoginForm>({
        username: "",
        password: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            setErrorMessage({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
            queryClient.resetQueries({ queryKey: ["currentUser"] });
            setErrorMessage(null);
            setFormData({ username: "", password: "" });
            navigate(lastVisitedURL);
        },
    });

    const handleSubmit = (data: UserLoginForm) => {
        mutate(data);
    };

    return (
        <FormWrapper
            title="Iniciar Sesión"
            button="Ingresar"
            fields={[
                { name: "username", type: "text", placeholder: "Tu usuario", label: "Usuario", autoComplete: "username" },
                { name: "password", type: "password", placeholder: "********", label: "Password", autoComplete: "current-password" },
            ]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
            extraTopLeft={
                <Link to="/forgot-password" className=" text-teal-400 hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
            }
            extraBelowButton={
                <p className="text-xs sm-500:text-sm text-gray-400 flex flex-col sm-380:flex-row gap-0 sm-380:gap-1 justify-center">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="text-teal-400 hover:underline">
                        Regístrate
                    </Link>
                </p>
            }
        />
    );
}

export default LoginView;
