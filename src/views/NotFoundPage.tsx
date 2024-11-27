import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
        
                <div className="mb-6 flex justify-center">
                    <ExclamationCircleIcon className="w-16 sm-500:w-20 text-teal-400" />
                </div>
                
                <h2 className="text-3xl sm-500:text-4xl font-semibold text-white mb-4">
                    Página No Encontrada
                </h2>
                
     
                <p className="text-base sm-500:text-lg text-gray-300 mb-6">
                    Lo sentimos, pero la página que estás buscando no existe o ha sido movida.
                </p>
                
                <div>
                <Link 
                    to="/" 
                    className="text-teal-400 text-base sm-500:text-lg font-semibold hover:underline"
                >
                    Volver al inicio
                </Link>
                </div>

            </div>
        </div>
    );
}

export default NotFoundPage;
