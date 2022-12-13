import {AppBindingLocations, CommandTrigger} from '../constant';
import manifest from '../manifest.json';
import {AppBinding, AppCallRequest, AppContext, AppsState} from '../types';

import {getHelpBinding} from './bindings';

const newHeaderButtonBindings = (bindings: AppBinding[]): AppsState => {
    const m = manifest;
    return {
        app_id: m.app_id,
        label: CommandTrigger,
        location: AppBindingLocations.CHANNEL_HEADER_ICON,
        bindings,
    };
};

export const getHeaderButtonBindings = async (call: AppCallRequest): Promise<AppsState> => {
    const bindings: AppBinding[] = [];
    const context = call.context as AppContext;

    bindings.push(getHelpBinding(context));

    return newHeaderButtonBindings(bindings);
};
