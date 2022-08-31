import { ConfigureClientForm } from "../constant";
import { GoogleToken } from "./google";
import { Oauth2Data } from "./kv-store";
import { UserProfile } from "./mattermost";

export type AppManifest = {
    app_id: string;
    display_name: string;
    description?: string;
    homepage_url?: string;
    root_url?: string;
}

export type AppModalState = {
    form: AppForm;
    call: AppCallRequest;
}

export type AppsState = {
    location: string;
    bindings: AppBinding[];
    app_id: string,
    label: string,
};

export type AppBinding = {
    app_id: string;
    location?: string;
    icon?: string;

    // Label is the (usually short) primary text to display at the location.
    // - For LocationPostMenu is the menu item text.
    // - For LocationChannelHeader is the dropdown text.
    // - For LocationCommand is the name of the command
    label: string;

    // Hint is the secondary text to display
    // - LocationPostMenu: not used
    // - LocationChannelHeader: tooltip
    // - LocationCommand: the "Hint" line
    hint?: string;

    // Description is the (optional) extended help.ts text, used in modals and autocomplete
    description?: string;


    // A Binding is either an action (makes a call), a Form, or is a
    // "container" for other locations - i.e. menu sub-items or subcommands.
    bindings?: AppBinding[];
    form?: AppForm;
    submit?: AppCall;
};

export type AppCallValues = {
    [name: string]: any;
};

export type AppCallType = string;

export type Oauth2CurrentUser = {
    refresh_token: string,
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

export type ChannelNotification = {
    channelId: string,
    resourceId: string,
}

export type Oauth2App = {
    client_id: string;
    client_secret: string;
    connect_url?: string;
    complete_url?: string;
    user?: Oauth2CurrentUser;
    data?: Oauth2Data;
}


export type AppCall = {
    path: string;
    expand?: AppExpand;
    state?: any;
};

export type AppCallRequest = AppCall & {
    context: AppContext;
    values?: AppCallValues;
    raw_command?: string;
    selected_field?: string;
    query?: string;
};

export type AppCallDialog<T> = {
    type: string;
    callback_id: string;
    state: string;
    user_id: string;
    channel_id: string;
    team_id: string;
    submission: T;
    cancelled: boolean;
}

export type AppCallAction<T> = {
    user_id: string;
    user_name: string;
    channel_id: string;
    channel_name: string;
    team_id: string;
    team_domain: string;
    post_id: string;
    trigger_id: string;
    type: string;
    data_source: string;
    context: T;
}

export type AppCallResponseType = string;

export type AppCallResponse<Res = unknown> = {
    type: AppCallResponseType;
    text?: string;
    data?: Res;
    error?: string;
    navigate_to_url?: string;
    use_external_browser?: boolean;
    call?: AppCall;
    form?: AppForm;
};

export type AppContext = {
    app_id: string;
    location?: string;
    user_agent?: string;
    track_as_submit?: boolean;
    mattermost_site_url?: string;
    developer_mode?: boolean;
    app_path?: string;
    bot_user_id?: string;
    bot_access_token?: string;
    app?: {
        SchemaVersion: string;
        app_id: string;
        version: string;
        homepage_url: string;
        deploy_type: string;
        webhook_secret: string;
        bot_user_id: string;
        bot_username: string;
        remote_oauth2: any;
    },
    channel?: {
        id: string;
        create_at: number;
        update_at: number;
        delete_at: number;
        team_id: string;
        type: string;
        display_name: string;
        name: string;
        header: string;
        purpose: string;
        last_post_at: number;
        total_msg_count: number;
        extra_update_at: number;
        creator_id: string;
        scheme_id: string;
        props: any;
        group_constrained: boolean;
        shared: any;
        total_msg_count_root: number;
        policy_id: any;
        last_root_post_at: number;
    }
    acting_user?: AppActingUser;
    acting_user_access_token?: string;
    oauth2: any;
};

export type AppContextProps = {
    [name: string]: string;
};

export type ExpandedBotActingUser = AppContext & {
    acting_user: UserProfile,
    acting_user_access_token: string
    bot_user_id: string,
    bot_access_token: string,
}

export type AppExpandLevel = string;

export type AppActingUser = {
    id: string,
    delete_at: number,
    username: string,
    auth_service: string,
    email: string,
    nickname: string,
    first_name: string,
    last_name: string,
    position: string,
    roles: string,
    locale: string,
    timezone: any,
    disable_welcome_email: boolean
}

export type AppExpand = {
    app?: AppExpandLevel;
    acting_user?: AppExpandLevel;
    acting_user_access_token?: AppExpandLevel;
    admin_access_token?: AppExpandLevel;
    channel?: AppExpandLevel;
    post?: AppExpandLevel;
    root_post?: AppExpandLevel;
    team?: AppExpandLevel;
    user?: AppExpandLevel;
    oauth2_app?: AppExpandLevel;
    oauth2_user?: AppExpandLevel;
    locale?: AppExpandLevel;
};

export type AppFormSubmit = {
    path: string;
    expand: AppExpand;
}

export type AppForm = {
    title?: string;
    header?: string;
    footer?: string;
    icon?: string;
    submit: AppFormSubmit;
    fields: AppField[];
    call?: AppCall;
    depends_on?: string[];
    source?: any;
};

export type AppFormValue = string | AppSelectOption | boolean | null;
export type AppFormValues = {[name: string]: AppFormValue};

export type AppSelectOption = {
    label: string;
    value: string;
    icon_data?: string;
};

export type AppFieldType = string;

// This should go in mattermost-redux
export type AppField = {
    // Name is the name of the JSON field to use.
    name: string;
    type: AppFieldType;
    is_required?: boolean;
    readonly?: boolean;

    // Present (default) value of the field
    value?: AppFormValue;
    placeholder?: string,
    description?: string;

    label?: string;
    hint?: string;
    position?: number;

    modal_label?: string;

    // Select props
    refresh?: boolean;
    options?: AppSelectOption[] | null;
    multiselect?: boolean;

    // Text props
    subtype?: string;
    min_length?: number;
    max_length?: number;
};

export type AutocompleteSuggestion = {
    suggestion: string;
    complete?: string;
    description?: string;
    hint?: string;
    iconData?: string;
}

export type AutocompleteSuggestionWithComplete = AutocompleteSuggestion & {
    complete: string;
}

export type AutocompleteElement = AppField;
export type AutocompleteStaticSelect = AutocompleteElement & {
    options: AppSelectOption[];
};

export type AutocompleteDynamicSelect = AutocompleteElement;

export type AutocompleteUserSelect = AutocompleteElement;

export type AutocompleteChannelSelect = AutocompleteElement;

export type FormResponseData = {
    errors?: {
        [field: string]: string;
    };
}

export type AppLookupResponse = {
    items: AppSelectOption[];
}

export type AppContextAction = {
    action: string;
    alert: {
        id: string;
        message: string;
        tinyId: string;
    }
    mattermost_site_url: string;
    bot_access_token: string;
    selected_option?: string;
}

