import {AppCallRequest, AppsState} from '../types';

import {getHeaderButtonBindings} from './header_commands';
import {getPostMenuBindings} from './post_menu';
import {getCommandBindings} from './slash_commands';

export async function getAppBindings(callRequest: AppCallRequest): Promise<AppsState[]> {
    const bindings: AppsState[] = [];
    bindings.push(await getCommandBindings(callRequest));
    bindings.push(await getHeaderButtonBindings(callRequest));
    bindings.push(await getPostMenuBindings(callRequest));

    return bindings;
}
