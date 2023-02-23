import {
    AppBindingLocations,
    CommandTrigger,
} from '../constant';
import {
    ExtendedAppBinding,
    ExtendedAppCallRequest,
    ExtendedAppContext,
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

const newPostMenuBindings = (bindings: ExtendedAppBinding[]): ExtendedAppBinding => {
    const m = manifest;
    return {
        app_id: m.app_id,
        label: CommandTrigger,
        location: AppBindingLocations.POST_MENU_ITEM,
        bindings,
    };
};

export const getPostMenuBindings = (call: ExtendedAppCallRequest): ExtendedAppBinding => {
    const oauth2App: Oauth2App = call.context.oauth2;
    const bindings: ExtendedAppBinding[] = [];
    const context: ExtendedAppContext = call.context;

    if (existsOauth2AppConfig(oauth2App)) {
        if (isConnected(oauth2App)) {
            bindings.push(saveFileOnDriveBinding(context));
        } else {
            bindings.push(getConnectBinding(context));
        }
    }

    return newPostMenuBindings(bindings);
};
