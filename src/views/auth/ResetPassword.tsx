import { useEffect, useState } from "react";
import { FormMessageStatus } from "../../components/FormStatusMessage";
import { NewPasswordForm } from "../../types/userTypes";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "../../api/AuthAPI";
import { toast } from "react-toastify";
import FormWrapper from "../../components/FormWrapper";
import { Link, useNavigate, useParams } from "react-router-dom";

function ResetPassword() {

    const { token } = useParams(); 
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<FormMessageStatus | null>(null);
    const [formData, setFormData] = useState<NewPasswordForm>({
        password: "",
        password_confirmation: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            setErrorMessage({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            setErrorMessage(null);
            setFormData({ password: "", password_confirmation: "" });
            toast.success("Tu password ha sido actualizada.");
            navigate("/login");
        },
    });

    const handleSubmit = (data: NewPasswordForm) => {
        mutate({formData: data, token: token || ""});
    };

    return (
        <FormWrapper
            title="Actualizar Password"
            button="Actualizar"
            fields={[
                { name: "password", type: "password", placeholder: "********", label: "Nuevo Password", autoComplete: "new-password" },
                { name: "password_confirmation", type: "password", placeholder: "********", label: "Confirmar Nuevo Password", autoComplete: "new-password" },
            ]}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
            extraBelowButton={
                <p className="text-xs sm-500:text-sm text-gray-400 flex flex-col sm-380:flex-row gap-0 sm-380:gap-1 justify-center">
                    ¿Has actualizado tu password?{" "}
                    <Link to="/login" className="text-teal-400 hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            }
        />
    )
}

export default ResetPassword