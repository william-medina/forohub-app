import { z } from 'zod';
import { authorSchema } from '.';


export const replySchema = z.object({
    id: z.number(),
    topicId: z.number(),
    content: z.string(),
    author: authorSchema,
    solution: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const repliesListSchema = z.array(replySchema);
export type Reply = z.infer<typeof replySchema>;

export type CreateReplyForm = Pick<Reply, 'content'> & { topicId: number };
export type UpdateReplyForm = Pick<Reply, 'content'>
