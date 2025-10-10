import { z } from 'zod';
import { repliesListSchema } from './replyTypes';
import { authorSchema, paginationInfoSchema } from '.';

export const statusSchema = z.enum(['ACTIVE', 'CLOSED']);
export type Status = z.infer<typeof statusSchema>

export type TopicType = 'created' | 'followed';

export const courseSchema = z.object({
    id: z.number(),
    name: z.string(),
    category: z.string()
})

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    profile: z.string()
})

export const followersSchema = z.object({
	user: userSchema,
	followedAt: z.string()
})

export const topicSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    author: z.string(),
    course: z.string(),
    category: z.string(),
    repliesCount: z.number(),
    status: statusSchema,
    createdAt: z.string(),
    updatedAt: z.string()
})

export const topicDetailsSchema = topicSchema.pick({
    id: true,
    title: true,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    course: courseSchema,
    author: authorSchema,
    replies: repliesListSchema, 
	followers: z.array(followersSchema)
});

export const followSchema = z.object({
    topic: topicSchema,
    followedAt: z.string()
})


export const topicListSchema = z.array(topicSchema);
export const followListSchema = z.array(followSchema);

export const topicListPageSchema = paginationInfoSchema.extend({
    content: topicListSchema
});

export const topicFollowListPageSchema = paginationInfoSchema.extend({
    content: followListSchema
});

export type Topic = z.infer<typeof topicSchema>;
export type TopicList = z.infer<typeof topicListSchema>;
export type TopicForm = Pick<Topic, 'title' | 'description'> & { courseId: number | null };;

