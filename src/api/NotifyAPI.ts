import api from "../config/axios";
import { Notify, notifyListSchema, notifySchema } from "../types/notifyTypes";
import { handleAxiosError } from "../utils";


export async function getAllNotificationsByUser() {
    
    try {
        const { data } = await api('/notify');
        const response = notifyListSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}


export async function markNotificationAsRead(notifyId: Notify['id']) {
    
    try {
        const { data } = await api.patch(`/notify/${notifyId}`);
        const response = notifySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}


export async function deleteNotify(notifyId: Notify['id']) {
    
    try {
        await api.delete(`/notify/${notifyId}`);
    } catch (error) {
        handleAxiosError(error);
    }
}