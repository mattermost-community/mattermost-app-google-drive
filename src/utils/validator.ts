import { z } from 'zod';

export const AppFormFieldValidator = z.object({
    name: z.string(),
    type: z.string(),
    is_required: z.boolean().optional(),
    readonly: z.boolean().optional(),
    value: z.any().optional(),
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
            icon_data: z.string().optional(),
        }),
    ]).optional(),
    multiselect: z.boolean().optional(),
    lookup: z.any().optional(),
    subtype: z.string().optional(),
    min_length: z.number().int().optional(),
    max_length: z.number().int().optional(),
});

export const AppFormValidator = z.object({
    title: z.string(),
    header: z.string().optional(),
    icon: z.string(),
    fields: z.array(AppFormFieldValidator).optional(),
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