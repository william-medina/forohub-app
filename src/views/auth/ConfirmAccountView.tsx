import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmAccount, requestConfirmationCode } from '../../api/AuthAPI';
import { toast } from 'react-toastify';
import FormStatusMessage, { FormMessageStatus } from '../../components/FormStatusMessage';
import { RequestConfirmationCodeForm } from '../../types/userTypes';

function ConfirmAccount() {

    const navigate = useNavigate();
    
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [progressBarValue, setProgressBarValue] = useState(0);


    const [formStatus, setFormStatus] = useState<FormMessageStatus | null>(null);
    const [confirmationFormData, setConfirmationFormData] = useState<RequestConfirmationCodeForm>({ email: "" });

    const { token } = useParams();


    const { data: confirmationData, isLoading: isTokenLoading } = useQuery({
        queryKey: ['confirmAccount', token],
        queryFn: () => confirmAccount(token || "-"),
    });

   console.log(confirmationData)
    useEffect(() => window.scrollTo(0, 0), []);

    useEffect(() => {
        if (isTokenLoading) {
            setStatusMessage('');
            setIsTokenValid(null);
            return;
        }
    
        if (confirmationData) {
            setIsTokenValid(true);
            setStatusMessage('Tu cuenta ha sido confirmada correctamente.');
            startProgressBarAnimation();
        } else {
            setIsTokenValid(false);
            setStatusMessage('El token ha expirado o es inválido.');
        }
    }, [isTokenLoading, confirmationData]);


    const startProgressBarAnimation = () => {
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 0.2;
                setProgressBarValue(progress);
            } else {
                clearInterval(interval);
                navigate("/login")
            }
        }, 15);
    };


    const { mutate: resendConfirmationEmail, isPending } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            setFormStatus({ type: "error", message: error.message || "Error inesperado. Intenta nuevamente." });
        },
        onSuccess: () => {
            setFormStatus(null);
            setConfirmationFormData({ email: "" });
            toast.success("Hemos reenviado el email de confirmación.");
        },
    });


    const handleResendToken = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resendConfirmationEmail(confirmationFormData);
    };

    return (
        <div className="min-h-[90vh] bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8">
                <div className="text-center mb-6">
                    <h2 className={`${isTokenValid || isTokenValid === null ? 'text-teal-400' : 'text-red-500'} text-3xl font-semibold mb-4`}>
                        {isTokenValid === null ? 'Verificando tu cuenta...' : isTokenValid ? '¡Cuenta Confirmada!' : 'Token Inválido o Expirado'}
                    </h2>
                    <p className="text-lg text-gray-300 mb-10 mt-6">{statusMessage}</p>
                </div>

                {isTokenValid === null ? (
                    <div className="text-gray-500 flex items-center justify-center">
                        
                        <span className="mr-4">Verificando token </span>
                        <div className="spinner"/>
                    </div>
                ) : isTokenValid ? (
                    <div>
                        <p className="text-gray-300 mb-4">Serás redirigido en breve...</p>
                        <div className="relative mt-4">
                            <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-500"
                                    style={{ width: `${progressBarValue}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleResendToken}>
                        {formStatus && (
                            <FormStatusMessage formStatus={formStatus} />
                        )}
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-gray-300 mb-2">Ingresa tu email para reenviar el token</label>
                            <input
                                type="email"
                                id="email"
                                value={confirmationFormData.email}
                                onChange={e => setConfirmationFormData({ email: e.target.value })}
                                className="w-full p-3 bg-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                                placeholder="Email"
                                autoComplete="email"
                            />
                        </div>
                        <div className="mt-5">
                            <button
                                type="submit"
                                className={`${isPending ? 'cursor-wait bg-gray-700 hover:bg-gray-700 text-gray-500' : 'cursor-pointer bg-teal-400 hover:bg-teal-500 text-gray-900'} w-full py-3 font-semibold rounded-md duration-300`}
                                disabled={isPending}
                            >
                                Reenviar Email
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ConfirmAccount;
