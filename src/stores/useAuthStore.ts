import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { UserData } from "../types/userTypes"
import { Notify } from "../types/notifyTypes"


type AuthStore = {
    userData: UserData | undefined
    isAuthenticated: boolean
    accessToken: string | null
    lastVisitedURL: string
    notifications: Notify[]
    isloadingNotify: boolean,

    setIsAuthenticated: (value: boolean) => void
    setAccessToken: (token: string | null) => void
    setLastVisitedURL: (value: string) => void
    setNotifications: (value: Notify[]) => void
    setIsLoadingNotify: (value: boolean) => void
    setData: (data: UserData | undefined) => void
    setUsername: (value: string) => void
    resetData: () => void
    
}

export const useAuthStore = create<AuthStore>()(
    devtools(
        (set) => ({
            userData: undefined,
            isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
            accessToken: null,
            lastVisitedURL: '/',
            notifications: [],
            isloadingNotify: true,

            setIsAuthenticated: (value) => set({isAuthenticated: value}),
            setAccessToken: (token) => set({ accessToken: token }),
            setLastVisitedURL: (value) => set({lastVisitedURL: value}),
            setNotifications: (value) => set({ notifications: value }),
            setIsLoadingNotify: (value) => set({ isloadingNotify: value }),
            setData: (value: UserData | undefined) => set({ userData: value}) ,
            resetData: () => {
                localStorage.removeItem("isAuthenticated");
                set({ userData: undefined, lastVisitedURL: '/', isAuthenticated: false, accessToken: null });
            },
            setUsername: (value) =>
                set((state) => ({
                    userData: state.userData
                        ? { ...state.userData, username: value }
                        : undefined,
                })),
            
        }), 
        { name: 'AuthStore' } 
    )
);