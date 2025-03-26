import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { UserData } from "../types/userTypes"
import { Notify } from "../types/notifyTypes"


type AuthStore = {
    userData: UserData | undefined
    isAuthenticated: boolean
    lastVisitedURL: string
    notifications: Notify[]
    isloadingNotify: boolean,

    setIsAuthenticated: (value: boolean) => void
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
            lastVisitedURL: '/',
            notifications: [],
            isloadingNotify: true,

            setIsAuthenticated: (value) => set({isAuthenticated: value}),
            setLastVisitedURL: (value) => set({lastVisitedURL: value}),
            setNotifications: (value) => set({ notifications: value }),
            setIsLoadingNotify: (value) => set({ isloadingNotify: value }),
            setData: (value: UserData | undefined) => set({ userData: value}) ,
            resetData: () => {
                localStorage.removeItem("isAuthenticated");
                set({ userData: undefined, lastVisitedURL: '/', isAuthenticated: false });
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