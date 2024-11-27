import { Author } from "../../types"
import { formatProfile, formatRelativeDate } from "../../utils"


type AuthorInfoProps = {
    isAuthor: boolean,
    author: Author,
    updatedAt: string
}

function AuthorInfo({isAuthor, author, updatedAt} : AuthorInfoProps) {
    return (
        <div className="flex justify-between flex-col gap-1 sm-500:flex-row">
            <div className={`text-xs sm-500:text-sm text-gray-400 mb-1 leading-3 sm-500:leading-4 ${isAuthor ? 'text-teal-400 font-bold' : 'text-gray-400'}`}>
                { isAuthor ? (
                    <span>● Tu respuesta</span>
                ) : (
                    <>
                        <span className="font-bold">Autor: </span> 
                        {author.username}
                        <span className="text-teal-400 font-bold">{formatProfile(author.profile)}</span>
                    </>
                )}
            </div>

            <div className="text-xs sm-500:text-sm text-gray-400 leading-3 sm-500:leading-4">
                <span className="font-bold">Actualizado: </span>
                {formatRelativeDate(new Date(updatedAt))}
            </div>
        </div>
    )
}

export default AuthorInfo