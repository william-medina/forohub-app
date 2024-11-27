import { Link } from "react-router-dom";
import FormWrapper from "../../components/FormWrapper";
import { RequestConfirmationCodeForm } from "../../types/userTypes";
import { FormMessageStatus } from "../../components/FormStatusMessage";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { requestConfirmationCode } from "../../api/AuthAPI";
import { toast } from "react-toastify";

function RequestCodeView() {
    
    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);
    const [formData, setFormData] = useState<RequestConfirmationCodeForm>({
        email: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            setErrorMessage({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            setErrorMessage(null);
            setFormData({ email: ""});
            toast.success("Hemos reenviado el email de confirmación.")
        },
    });

    const handleSubmit = (data: RequestConfirmationCodeForm) => {
        mutate(data);
    };

    return (
        <FormWrapper
            title="Reenviar email de confirmación"
            button="Reenviar Email"
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
                    ¿Has confirmado tu cuenta?
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            }
        />
    )
}

export default RequestCodeView