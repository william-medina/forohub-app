import api from "../config/axios";
import { TopicForm, Status, Topic, topicDetailsSchema, topicListPageSchema, topicSchema, followSchema, topicFollowListPageSchema } from "../types/topicTypes";
import { handleAxiosError } from "../utils";


export async function getAllTopics(
        currentPage: number, 
        searchKeyword: string, 
        selectedStatus: null | Status, 
        selectedCourseId: null | number
    ) {
        
    try {

        const keywordParam = searchKeyword ? `&keyword=${encodeURIComponent(searchKeyword)}` : '';
        const statusParam = selectedStatus !== null ? `&status=${selectedStatus}` : '';
        const courseIdParam = selectedCourseId !== null ? `&courseId=${selectedCourseId}` : '';
      
        const { data } = await api(`/topic?page=${currentPage}${keywordParam}${statusParam}${courseIdParam}`);
        const response = topicListPageSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}


export async function getAllTopicsByUser(
    currentPage: number, 
    searchKeyword: string, 
) {
    
    try {

        const keywordParam = searchKeyword ? `&keyword=${encodeURIComponent(searchKeyword)}` : '';
    
        const { data } = await api(`/topic/user/topics?page=${currentPage}${keywordParam}`);
        const response = topicListPageSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getTopicById(topicId: Topic['id']) {
    
    try {
        const { data } = await api(`/topic/${topicId}`);
        const response = topicDetailsSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function createTopic(formData: TopicForm) {
    
    try {
        const { data } = await api.post('/topic', formData);
        const response = topicSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateTopic({topicId, formData } : {topicId: Topic['id'], formData: TopicForm}) {
    
    try {
        const { data } = await api.put(`/topic/${topicId}`, formData);
        const response = topicDetailsSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteTopic(topicId: Topic['id']) {
    
    try {
        await api.delete(`/topic/${topicId}`);
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function toggleFollowTopic(topicId: Topic['id']) {
    
    try {
        const { data } = await api.post(`/topic/follow/${topicId}`);
        const response = followSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getFollowedTopicsByUser(
    currentPage: number, 
    searchKeyword: string, 
) {
    
    try {

        const keywordParam = searchKeyword ? `&keyword=${encodeURIComponent(searchKeyword)}` : '';
    
        const { data } = await api(`/topic/user/followed-topics?page=${currentPage}${keywordParam}`);
        const response = topicFollowListPageSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}