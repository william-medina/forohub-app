import api from "../config/axios";
import { Response, CreateResponseForm, responseSchema, UpdateResponseForm } from "../types/responseTypes";
import { handleAxiosError } from "../utils";


export async function addResponse(formData: CreateResponseForm) {
    
    try {
        const { data } = await api.post('/response', formData);
        const response = responseSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function setCorrectResponse(responseId: Response['id']) {
    
    try {
        const { data } = await api.patch(`/response/${responseId}`);
        const response = responseSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateResponse({responseId, formData } : {responseId: Response['id'], formData: UpdateResponseForm}) {
    
    try {
        const { data } = await api.put(`/response/${responseId}`, formData);
        const response = responseSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteResponse(responseId: Response['id']) {
    
    try {
        await api.delete(`/response/${responseId}`);
    } catch (error) {
        handleAxiosError(error);
    }
}