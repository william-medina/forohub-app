import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { UserData } from "../types/userTypes"
import { Notify } from "../types/notifyTypes"


type AuthStore = {
    userData: UserData | undefined
    lastVisitedURL: string
    notifications: Notify[]
    isloadingNotify: boolean,

    setLastVisitedURL: (value: string) => void
    setNotifications: (value: Notify[]) => void
    setIsLoadingNotify: (value: boolean) => void
    setData: (data: UserData | undefined) => void
    setUsername: (value: string) => void
    resetData: () => void
    
}

const initialData: UserData | undefined = {
    id: 0,
    username: '',
    profile: 'USER',
}

export const useAuthStore = create<AuthStore>()(
    devtools(
        (set) => ({
            userData: initialData,

            lastVisitedURL: '/',

            notifications: [],

            isloadingNotify: true,

            setLastVisitedURL: (value) => set({lastVisitedURL: value}),
            setNotifications: (value) => set({ notifications: value }),
            setIsLoadingNotify: (value) => set({ isloadingNotify: value }),
            setData: (value: UserData | undefined) => set({ userData: value }),
            resetData: () => {
                set({ userData: initialData });
                set({ lastVisitedURL: '/'});
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