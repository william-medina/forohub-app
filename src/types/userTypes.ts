import { z } from 'zod';
import { profileSchema } from '.';

export const userSchema = z.object({
    id: z.number(),
    email: z.string(),
    username: z.string(),    
    password: z.string(),
    password_confirmation: z.string(),
    current_password: z.string(),
    token: z.string(),
    profile: profileSchema,
    topicsCount: z.number(),
    responsesCount: z.number(),
    followedTopicsCount: z.number()  
})

export const userDataSchema = userSchema.pick({
    id: true,
    username: true,
    profile: true
});

export const userStatsSchema = userSchema.pick({
    topicsCount: true,
    responsesCount: true,
    followedTopicsCount: true
})

export const userDataWithTokenSchema = userDataSchema.extend({token: z.string()})

export const tokenSchema = z.object({token: z.string()});

type User = z.infer<typeof userSchema>
export type UserData = z.infer<typeof userDataSchema>
export type UserStats = z.infer<typeof userStatsSchema>
export type UserDataWithToken = z.infer<typeof userDataWithTokenSchema>
export type UserLoginForm = Pick<User, 'username' | 'password'>
export type UserRegistrationForm  = Pick<User, 'username' | 'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<User, 'email'>
export type ForgotPasswordForm = Pick<User, 'email'>
export type NewPasswordForm = Pick<User, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<User, 'current_password' | 'password' | 'password_confirmation'>
export type Token = Pick<User, 'token'>
export type UsernameForm = Pick<User, 'username'>