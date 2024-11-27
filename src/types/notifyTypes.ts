import { z } from 'zod';

export const notifyTypeSchema = z.enum(["TOPIC", "RESPONSE"]);
export const notifySubtypeSchema = z.enum(["REPLY", "EDITED", "SOLVED", "DELETED"]);

export type NotifyType = z.infer<typeof notifyTypeSchema>
export type NotifySubtype = z.infer<typeof notifySubtypeSchema>

export const notifySchema = z.object({
    id: z.number(),
    username: z.string(),
    topicId: z.number().nullable(),
    type: notifyTypeSchema,
    subtype: notifySubtypeSchema,
    title: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    createdAt: z.string()
})

export const notifyListSchema = z.array(notifySchema);

export type Notify = z.infer<typeof notifySchema>;