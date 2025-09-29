import { Link } from "react-router-dom";
import FormWrapper from "../../components/FormWrapper"
import { UserRegistrationForm } from "../../types/userTypes";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../../api/AuthAPI";
import { useEffect, useState } from "react";
import { FormMessageStatus } from "../../components/FormStatusMessage";
import { toast } from "react-toastify";
import { ApiErrorResponse } from "../../types/errorResponseTypes";

function RegisterView() {

    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);
    const [formData, setFormData] = useState<UserRegistrationForm>({
        email: "",
        username: "",
        password: "",
        password_confirmation: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: createAccount,
        onError: (error: ApiErrorResponse) => {
            setErrorMessage({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            setErrorMessage(null);
            setFormData({ email: "", username: "", password: "", password_confirmation: "" });
            toast.success("Hemos enviado un email para confirmar tu cuenta.")
        },
    });

    const handleSubmit = (data: UserRegistrationForm) => {
        mutate(data);
    };

    return (
        <FormWrapper
            title="Registrarse"
            button="Registrarse"
            fields={[
                { name: "email", type: "email", placeholder: "Tu email", label: "Email", autoComplete: "email" },
                { name: "username", type: "text", placeholder: "Tu usuario", label: "Usuario", autoComplete: "username" },
                { name: "password", type: "password", placeholder: "********", label: "Password", autoComplete: "new-password" },
                { name: "password_confirmation", type: "password", placeholder: "********", label: "Confirmar password", autoComplete: "new-password" },
            ]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
            extraTopLeft={
                <Link to="/request-code" className=" text-teal-400 hover:underline">
                    ¿No recibiste email de confirmación?
                </Link>
            }
            extraBelowButton={
                <p className="text-xs sm-500:text-sm text-gray-400 flex flex-col sm-380:flex-row gap-0 sm-380:gap-1 justify-center">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            }
        />
    )
}

export default RegisterView