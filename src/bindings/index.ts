import { ExtendedAppBinding, ExtendedAppCallRequest } from '../types';

import { getHeaderButtonBindings } from './header_commands';
import { getPostMenuBindings } from './post_menu';
import { getCommandBindings } from './slash_commands';

export async function getAppBindings(callRequest: ExtendedAppCallRequest): Promise<ExtendedAppBinding[]> {
    const bindings: ExtendedAppBinding[] = [];
    const commands: ExtendedAppBinding = getCommandBindings(callRequest);
    if (commands.bindings?.length) {
        bindings.push(commands);
    }

    const headers = getHeaderButtonBindings(callRequest);
    if (headers.bindings?.length) {
        bindings.push(headers);
    }

    const postMenu = getPostMenuBindings(callRequest);
    if (postMenu.bindings?.length) {
        bindings.push(postMenu);
    }

    return bindings;
}
