import { z } from 'zod';

export const AppFormValidator = z.object({
    title: z.string(),
    header: z.string().optional(),
    icon: z.string(),
    fields: z.array(z.any()).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.any(),
        state: z.any().optional(),
    }),
    source: z.object({
        path: z.string(),
        expand: z.object({
            locale: z.string(),
            acting_user: z.string(),
            acting_user_access_token: z.string(),
        }),
    }).optional(),
});

export const ExtendedAppFormValidator = z.object({
    title: z.string(),
    icon: z.string(),
    fields: z.array(z.any()).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.any(),
    }),
    source: z.object({
        path: z.string(),
        expand: z.object({ acting_user: z.string(), locale: z.string() }),
    }).optional(),
});