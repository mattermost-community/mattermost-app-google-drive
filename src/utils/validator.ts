import { z } from 'zod';

export const AppFormValidator = z.object({
    title: z.string(),
    header: z.string().optional(),
    icon: z.string(),
    fields: z.tuple([
        z.object({
            type: z.string(),
            name: z.string(),
            subtype: z.string(),
            modal_label: z.string(),
            description: z.string(),
            is_required: z.boolean(),
        }),
    ]).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_user: z.string(),
            oauth2_app: z.string(),
            post: z.string(),
        }),
        state: z.record(z.any()).optional(),
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
    fields: z.tuple([
        z.object({
            name: z.string(),
            type: z.string(),
            is_required: z.boolean().optional(),
            readonly: z.boolean().optional(),
            value: z.string().optional(),
            description: z.string().optional(),
            label: z.string().optional(),
            hint: z.string().optional(),
            position: z.number().int().optional(),
            modal_label: z.string().optional(),
            refresh: z.boolean().optional(),
            options: z.tuple([
                z.object({
                    label: z.string(),
                    value: z.string(),
                    icon_data: z.string(),
                }),
            ]).optional(),
            multiselect: z.boolean().optional(),
            lookup: z.string().optional(),
            subtype: z.string().optional(),
            min_length: z.number().int().optional(),
            max_length: z.number().int().optional(),
        }),
    ]).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_app: z.string(),
            oauth2_user: z.string(),
            channel: z.string(),
            locale: z.string(),
        }),
    }),
    source: z.object({
        path: z.string(),
        expand: z.object({ acting_user: z.string(), locale: z.string() }),
    }).optional(),
});