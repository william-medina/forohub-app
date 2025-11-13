import api from "../config/axios";
import { AppConfig } from "../config/env";
import { useAuthStore } from "../stores/useAuthStore";
import { Token, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UpdateCurrentUserPasswordForm, userDataSchema, UserLoginForm, UsernameForm, UserRegistrationForm, tokenSchema, userStatsSchema } from "../types/userTypes";
import { handleAxiosError } from "../utils";



export async function createAccount(formData : UserRegistrationForm) {
    try {
        const url = '/auth/create-account'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function authenticateUser(formData: UserLoginForm) {
    try {
        const url = '/auth/login'
        const { data } = await api.post(url, formData)
        const response = tokenSchema.safeParse(data);
            if(response.success) {
                useAuthStore.getState().setAccessToken(response.data.accessToken);
                return response.data;
            }
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function confirmAccount(token: Token['accessToken']) {
    try {
        const url = `/auth/confirm-account/${token}`
        const { data } = await api.get(url)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function requestConfirmationCode(formData: RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: Token['accessToken']}) {
    try {
        const url = `/auth/update-password/${token}`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateCurrentPassword(passwordForm: UpdateCurrentUserPasswordForm) {
    try {
        const url = '/auth/update-password'
        const { data } = await api.patch(url, passwordForm)
        return data
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateUsername(usernameForm: UsernameForm) {
    try {
        const url = '/auth/update-username'
        const { data } = await api.patch(url, usernameForm)
        const response = userDataSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getUserStats() {
    try {
        const url = '/auth/stats'
        const { data } = await api(url)
        const response = userStatsSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getCurrentUser() {
    try {
        const { data } = await api('/auth/me');
        const response = userDataSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function logoutUser() {
    try {
        const url = AppConfig.isMicroservices ? AppConfig.tokenUrl + "/logout" : '/auth/token/logout'
        const { data } = await api.post(url);

        useAuthStore.getState().setAccessToken(null);
        
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}