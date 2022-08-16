export type UserNotifyProps = {
    channel: string;
    comments: string;
    desktop: string;
    desktop_sound: string;
    desktop_threads: string;
    email: string;
    email_thread: string;
    first_name: string;
    mention_keys: string;
    push: string;
    push_status: string;
    push_threads: string;
}

export type UserTimezone = {
    useAutomaticTimezone: boolean | string;
    automaticTimezone: string;
    manualTimezone: string;
};

export type UserProfile = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    username: string;
    auth_data: string;
    auth_service: string;
    email: string;
    nickname: string;
    first_name: string;
    last_name: string;
    position: string;
    roles: string;
    allow_marketing: boolean;
    notify_props: UserNotifyProps;
    last_password_update: number;
    locale: string;
    timezone?: UserTimezone;
}

export type BindingOptions = {
    isSystemAdmin: boolean,
    isConfigured: boolean,
    isConnected: boolean
    mattermostSiteUrl: string
}

export type User = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    username: string;
    auth_data: string;
    auth_service: string;
    email: string;
    nickname: string;
    first_name: string;
    last_name: string;
    position: string;
    roles: string;
    last_picture_update: number;
    locale: string;
    timezone: {
        automaticTimezone: string;
        manualTimezone: string;
        useAutomaticTimezone: string;
    };
    is_bot: boolean;
    bot_description: string;
    disable_welcome_email: false;
};

export type Channel = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    team_id: string;
    type: string,
    display_name: string;
    name: string;
    header: string;
    purpose: string;
    last_post_at: number;
    total_msg_count: number;
    extra_update_at: number;
    creator_id: string;
};

export type AttachmentOption = {
    text: string;
    value: string;
};

export type AttachmentAction = {
    id: string;
    name: string;
    type: string;
    style?: string;
    data_source?: string;
    integration: {
        url: string;
        context: any;
    };
    options?: AttachmentOption[];
}

export type Attachment = {
    text?: string;
    title?: string;
    title_link?: string;
    fields?: {
        short: boolean;
        title: string;
        value: string;
    }[];
    actions?: AttachmentAction[]
};

export type PostCreate = {
    channel_id: string;
    message: string;
    root_id?: string;
    file_ids?: string[];
    props?: {
        attachments: Attachment[];
    }
}

export type PostEphemeralCreate = {
    user_id: string;
    post: PostCreate;
}

export type PostResponse = {
    id: string,
    create_at: number,
    update_at: number,
    edit_at: 0,
    delete_at: 0,
    is_pinned: false,
    user_id: string,
    channel_id: string,
    root_id: string,
    original_id: string,
    message: string,
    props: { attachments: Attachment[]; }
}

export type PostUpdate = {
    id: string;
    is_pinned?: boolean;
    message?: string;
    has_reactions?: boolean;
    props?: {
        attachments: Attachment[];
    }
}

export type DialogElementText = {
    display_name: string; // Display name of the field shown to the user in the dialog. Maximum 24 characters.
    name: string; // Name of the field element used by the integration. Maximum 300 characters. You should use unique name fields in the same dialog.
    type: string; // Set this value to text for a text element.
    subtype?: string; // (Optional) One of text, email, number, password (as of v5.14), tel, or url. Default is text. Use this to set which keypad is presented to users on mobile when entering the field.
    min_length?: number; // (Optional) Minimum input length allowed for an element. Default is 0.
    max_length?: number; // (Optional) Maximum input length allowed for an element. Default is 150. If you expect the input to be greater 150 characters, consider using a textarea type element instead.
    optional?: boolean; // (Optional) Set to true if this form element is not required. Default is false.
    help_text?: string; // (Optional) Set help text for this form element. Maximum 150 characters.
    default?: string; // (Optional) Set a default value for this form element. Maximum 150 characters.
    placeholder?: string // (Optional) A string displayed to help guide users in completing the element. Maximum 150 characters.
}

export type DialogElementTextarea = {
    display_name: string; // Display name of the field shown to the user in the dialog. Maximum 24 characters.
    name: string; // Name of the field element used by the integration. Maximum 300 characters. You should use unique name fields in the same dialog.
    type: string; // Set this value to text for a text element.
    subtype?: string; // (Optional) One of text, email, number, password (as of v5.14), tel, or url. Default is text. Use this to set which keypad is presented to users on mobile when entering the field.
    min_length?: number; // (Optional) Minimum input length allowed for an element. Default is 0.
    max_length?: number; // (Optional) Maximum input length allowed for an element. Default is 3000.
    optional?: boolean; // (Optional) Set to true if this form element is not required. Default is false.
    help_text?: string; // (Optional) Set help text for this form element. Maximum 150 characters.
    default?: string; // (Optional) Set a default value for this form element. Maximum 3000 characters.
    placeholder?: string // (Optional) A string displayed to help guide users in completing the element. Maximum 3000 characters.
}

export type DialogElementSelect = {
    display_name: string; // Display name of the field shown to the user in the dialog. Maximum 24 characters.
    name: string; // Name of the field element used by the integration. Maximum 300 characters. You should use unique name fields in the same dialog.
    type: string; // Set this value to select for a select element.
    data_source?: string; // (Optional) One of users, or channels. If none specified, assumes a manual list of options is provided by the integration.
    optional?: boolean; // (Optional) Set to true if this form element is not required. Default is false.
    options?: { // dropdown options
        text: string;
        value: string;
    }[];
    help_text?: any[]; // (Optional) An array of options for the select element. Not applicable for users or channels data sources.
    default?: string; // (Optional) Set a default value for this form element. Maximum 3,000 characters.
    placeholder?: string; // (Optional) A string displayed to help guide users in completing the element. Maximum 150 characters.
}

export type DialogElementCheckbox = {
    display_name: string; // Display name of the field shown to the user in the dialog. Maximum 24 characters.
    name: string; // Name of the field element used by the integration. Maximum 300 characters. You should use unique name fields in the same dialog.
    type: string; // Set this value to bool for a checkbox element.
    optional?: boolean; // (Optional) Set to true if this form element is not required. Default is false.
    help_text?: string; // (Optional) Set help text for this form element. Maximum 150 characters.
    default?: string; // (Optional) Set a default value for this form element. true or false.
    placeholder?: string; // (Optional) A string displayed to include a label besides the checkbox. Maximum 150 characters.
}

export type DialogElementRadio = {
    display_name: string; // Display name of the field shown to the user in the dialog. Maximum 24 characters.
    name: string; // Name of the field element used by the integration. Maximum 300 characters. You should use unique name fields in the same dialog.
    type: string; // Set this value to radio for a radio element.
    options?: any[] // (Optional) An array of options for the radio element.
    help_text?: string; // (Optional) Set help text for this form element. Maximum 150 characters.
    default: string; // (Optional) Set a default value for this form element.
}

export type DialogProps = {
    trigger_id: string;
    url: string;
    dialog: {
        callback_id?: string;
        title: string; // Title of the dialog. Maximum 24 characters.
        introduction_text?: string; // Markdown-formatted introduction text which is displayed above the dialog elements.
        elements: (DialogElementText | DialogElementTextarea | DialogElementSelect | DialogElementCheckbox | DialogElementRadio)[]; // Up to 5 elements allowed per dialog. See below for more details on elements. If none are supplied the dialog box acts as a simple confirmation.
        url?: string; // The URL to send the submitted dialog payload to.
        icon_url?: string; // (Optional) The URL of the icon used for your dialog. If none specified, no icon is displayed.
        submit_label?: string; // (Optional) Label of the button to complete the dialog. Default is Submit.
        notify_on_cancel?: boolean; // (Optional) When true, sends an event back to the integration whenever there’s a user-induced dialog cancellation. No other data is sent back with the event. Default is false.
        state?: string; // (Optional) String provided by the integration that will be echoed back with dialog submission. Default is the empty string.
    }
}

export type MattermostOptions = {
    mattermostUrl: string;
    accessToken: string | null | undefined;
}