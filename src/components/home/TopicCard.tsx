import { CheckCircleIcon } from "@heroicons/react/16/solid"
import { Topic } from "../../types/topicTypes"
import { formatRelativeDate, formatRepliesCount } from "../../utils"
import { Link } from "react-router-dom"

type TopicCardProps = {
    topic: Topic
}

function TopicCard({ topic }: TopicCardProps) {
    const isActive = topic.status === 'ACTIVE'
    const iconColor = isActive ? 'text-gray-500' : 'text-teal-300' 
    const relativeDate = formatRelativeDate(new Date(topic.createdAt))
    const replyText = formatRepliesCount(topic.repliesCount)

    return (
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <Link to={`/topic/${topic.id}`}>
                    <h3 className="text-lg sm-500:text-xl leading-5 sm-500:leading-7 font-semibold text-white hover:text-teal-400 transition-colors duration-300">{topic.title}</h3>
                </Link>
                <CheckCircleIcon className={`w-5 sm-500:w-6 ml-2 ${iconColor} shrink-0`} />
            </div>
        
            <div className="border-b-2 border-gray-600 my-2"></div>
        
            <div className="flex justify-between text-xs sm-500:text-sm">
                <div className="flex flex-col text-gray-400 space-y-2">
                    <span className="inline-block text-teal-300 bg-gray-700 px-2 py-1 rounded-sm w-fit">
                        {topic.category}
                    </span>
                    <p className="font-medium text-gray-300 ml-1">{replyText}</p>
                </div>
                <div className="flex flex-col text-right justify-end text-gray-400">
                    <p className="text-gray-400 text-end">{topic.author}</p>
                    <p className="text-gray-400">{relativeDate}</p>
                </div>
            </div>
        </div>
    )
}

export default TopicCard
