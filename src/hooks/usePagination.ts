import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Status, TopicType } from "../types/topicTypes";

export function usePagination() {

    const [searchParams, setSearchParams] = useSearchParams();
    
    
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const initialKeyword = searchParams.get("keyword") || "";
    const initialStatus = searchParams.get("status") as Status || null;
    const initialCourseId = parseInt(searchParams.get("courseId") || "0", 10) || null;
    const initialTopicType = searchParams.get("topicType") as TopicType || "created";

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
    const [selectedStatus, setSelectedStatus] = useState<null | Status>(initialStatus);
    const [selectedCourseId, setSelectedCourseId] = useState<null | number>(initialCourseId);
    const [selectedTopicType, setSelectedTopicType] = useState<TopicType>(initialTopicType);

    const [isFirstChange, setIsFirstChange] = useState(true);  
    
    useEffect(() => {

        const newParams: { [key: string]: string } = {};
        
        if (currentPage > 1) newParams.page = currentPage.toString();
        if (searchKeyword)  newParams.keyword = searchKeyword;
        if (selectedStatus)  newParams.status = selectedStatus; 
        if (selectedCourseId)  newParams.courseId = selectedCourseId.toString();
        if (selectedTopicType === "followed")  newParams.topicType = selectedTopicType; 

        if(!isFirstChange) setSearchParams(newParams);

    }, [currentPage, searchKeyword, selectedStatus, selectedCourseId, setSearchParams, selectedTopicType, isFirstChange]);

    
    useEffect(() => {
        if (searchKeyword !== initialKeyword || 
            selectedStatus !== initialStatus || 
            selectedCourseId !== initialCourseId || 
            selectedTopicType !== initialTopicType 
        ) {
            setIsFirstChange(false);
        } 
        
        if(!isFirstChange) {
            setCurrentPage(1);
        }
      
    }, [searchKeyword, selectedStatus, selectedCourseId, selectedTopicType]);

    useEffect(() => {
        if (currentPage > 1) {
            setIsFirstChange(false);
        }
    }, [currentPage])

    return {
        currentPage,
        setCurrentPage,
        searchKeyword,
        setSearchKeyword,
        selectedStatus,
        setSelectedStatus,
        selectedCourseId,
        setSelectedCourseId,
        selectedTopicType,
        setSelectedTopicType
    };
}
