import { toast } from "react-toastify";
import FormWrapper from "../../components/FormWrapper"
import { ForgotPasswordForm } from "../../types/userTypes";
import { forgotPassword } from "../../api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormMessageStatus } from "../../components/FormStatusMessage";
import { Link } from "react-router-dom";
import { ApiErrorResponse } from "../../types/errorResponseTypes";


function ForgotPasswordView() {

    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);
    const [formData, setFormData] = useState<ForgotPasswordForm>({
        email: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword,
        onError: (error: ApiErrorResponse) => {
            setErrorMessage({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            setErrorMessage(null);
            setFormData({ email: ""});
            toast.success("Hemos enviado un email para restablecer tu password.")
        },
    });

    const handleSubmit = (data: ForgotPasswordForm) => {
        mutate(data);
    };

    return (
        <FormWrapper
            title="Restablecer Password"
            button="Enviar Email"
            fields={[
                { name: "email", type: "email", placeholder: "Tu email", label: "Email", autoComplete: "email" },
            ]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
            extraBelowButton={
                <p className="text-xs sm-500:text-sm text-gray-400 flex flex-col sm-380:flex-row gap-0 sm-380:gap-1 justify-center">
                    ¿Has restablecido tu password?
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            }
        />
    )
}

export default ForgotPasswordView