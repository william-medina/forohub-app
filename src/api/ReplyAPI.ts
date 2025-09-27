import api from "../config/axios";
import { Reply, CreateReplyForm, replySchema, UpdateReplyForm } from "../types/replyTypes";
import { handleAxiosError } from "../utils";


export async function addReply(formData: CreateReplyForm) {
    
    try {
        const { data } = await api.post('/reply', formData);
        const response = replySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function setCorrectReply(replyId: Reply['id']) {
    
    try {
        const { data } = await api.patch(`/reply/${replyId}`);
        const response = replySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateReply({replyId, formData } : {replyId: Reply['id'], formData: UpdateReplyForm}) {
    
    try {
        const { data } = await api.put(`/reply/${replyId}`, formData);
        const response = replySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteReply(replyId: Reply['id']) {
    
    try {
        await api.delete(`/reply/${replyId}`);
    } catch (error) {
        handleAxiosError(error);
    }
}