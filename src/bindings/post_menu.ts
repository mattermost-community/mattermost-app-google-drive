import {
    AppBindingLocations,
    CommandTrigger,
} from '../constant';
import {
    AppBinding,
    AppCallRequest,
    AppContext,
    AppsState,
    Oauth2App,
} from '../types';
import {
    existsOauth2AppConfig,
    isConnected,
} from '../utils/utils';

import manifest from '../manifest.json';

import {
    getConnectBinding,
    saveFileOnDriveBinding,
} from './bindings';

const newPostMenuBindings = (bindings: AppBinding[]): AppsState => {
    const m = manifest;
    return {
        app_id: m.app_id,
        label: CommandTrigger,
        location: AppBindingLocations.POST_MENU_ITEM,
        bindings,
    };
};

export const getPostMenuBindings = async (call: AppCallRequest): Promise<AppsState> => {
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
    const bindings: AppBinding[] = [];
    const context = call.context as AppContext;

    if (await existsOauth2AppConfig(oauth2App)) {
        if (isConnected(oauth2App)) {
            bindings.push(saveFileOnDriveBinding(context));
        } else {
            bindings.push(getConnectBinding(context));
        }
    }

    return newPostMenuBindings(bindings);
};
