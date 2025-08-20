import { z } from 'zod';
import { authorSchema } from '.';


export const responseSchema = z.object({
    id: z.number(),
    topicId: z.number(),
    content: z.string(),
    author: authorSchema,
    solution: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const responsesListSchema = z.array(responseSchema);
export type Response = z.infer<typeof responseSchema>;

export type CreateResponseForm = Pick<Response, 'content'> & { topicId: number };
export type UpdateResponseForm = Pick<Response, 'content'>
