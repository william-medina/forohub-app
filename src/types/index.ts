import { z } from 'zod';

export const profileSchema = z.enum(['ADMIN', 'INSTRUCTOR', 'MODERATOR', 'USER']);
export type Profile = z.infer<typeof profileSchema>

export const authorSchema = z.object({
    username: z.string(),
    profile: profileSchema    
})

export type Author = z.infer<typeof authorSchema>;

export type ActionState = {
    isAuthor: boolean,
    isStaffRole: boolean,
    isEditing: boolean,
    isDeleting: boolean,
    isFollower: boolean,
};


export const paginationInfoSchema = z.object({
    number: z.number(),
    totalPages: z.number(),
    totalElements: z.number(),
    first: z.boolean(),
    last: z.boolean()
});

export type PaginationInfo = z.infer<typeof paginationInfoSchema>;