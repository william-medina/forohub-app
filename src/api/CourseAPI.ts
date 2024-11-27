import api from "../config/axios";
import { courseListSchema } from "../types/courseTypes";
import { handleAxiosError } from "../utils";

export async function getCourses() {
    try {
        const url = '/course'
        const { data } = await api(url)
        const response = courseListSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}