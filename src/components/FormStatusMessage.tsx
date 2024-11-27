export type FormMessageStatus = {
    type: 'success' | 'error';
    message: string;
} | null;

type FormStatusMessageProps = {
    formStatus: FormMessageStatus;
};

function FormStatusMessage({ formStatus }: FormStatusMessageProps) {
    if (formStatus) {
        return (
            <div
                className={`${
                    formStatus.type === 'error'
                        ? ' text-white  bg-red-800'
                        : ' text-teal-400 border-teal-400'
                } text-xs sm-500:text-sm leading-3 sm-500:leading-4 px-3 sm-500:px-4 py-3 w-full rounded-lg`}
            >
                {formStatus.message}
            </div>
        );
    }
    return null;
}

export default FormStatusMessage;
