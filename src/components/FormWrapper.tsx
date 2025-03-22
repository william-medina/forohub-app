import { ChangeEvent, FormEvent, ReactNode } from "react";
import FormStatusMessage, { FormMessageStatus } from "./FormStatusMessage";

type FormWrapperProps<T> = {
    title: string;
    button: string;
    fields: {
        name: string;
        type: string;
        placeholder: string;
        label: string;
        autoComplete?: string;
    }[];
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    onSubmit: (formData: T) => void;
    isPending: boolean;
    errorMessage: FormMessageStatus | null;
    extraTopLeft?: ReactNode;
    extraBelowButton?: ReactNode;
};

function FormWrapper<T>({
    title,
    button,
    fields,
    formData,
    setFormData,
    onSubmit,
    isPending = false,
    errorMessage,
    extraTopLeft,
    extraBelowButton,
}: FormWrapperProps<T>) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-900 mx-5">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-teal-400 text-center mb-6">{title}</h2>
                <form onSubmit={handleSubmit}>
                    {errorMessage && <FormStatusMessage formStatus={errorMessage} />}
                    {fields.map((field) => (
                        <div key={field.name} className="mt-5">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1 sm-500:mb-2">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                className="w-full p-2 sm-500:p-3 text-sm sm-500:text-base rounded-sm bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-teal-400"
                                placeholder={field.placeholder}
                                value={(formData as any)[field.name]}
                                onChange={handleChange}
                                autoComplete={field.autoComplete}
                            />
                        </div>
                    ))}
                    {extraTopLeft && <div className="text-xs sm-500:text-sm leading-4 mt-2 text-left">{extraTopLeft}</div>}
                    <button
                        type="submit"
                        className={`${
                            isPending ? "cursor-wait bg-gray-700 text-gray-500 hover:bg-gray-700" : "cursor-pointer bg-teal-400 text-gray-900 hover:bg-teal-500"
                        } mt-5 w-full p-2 sm-500:p-3 text-sm sm-500:text-base rounded  font-semibold  transition duration-300`}
                        disabled={isPending}
                    >
                        {button}
                    </button>
                    {extraBelowButton && <div className="mt-6 text-center">{extraBelowButton}</div>}
                </form>
            </div>
        </div>
    );
}

export default FormWrapper;
