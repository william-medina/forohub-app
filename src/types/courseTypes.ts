import { z } from 'zod';

export const courseSchema = z.object({
    id: z.number(),
    name: z.string(),
    category: z.string(),
})


export const courseListSchema = z.array(courseSchema);
export type Course = z.infer<typeof courseSchema>;
export type CourseList = z.infer<typeof courseListSchema>;