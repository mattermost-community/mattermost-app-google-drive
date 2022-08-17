import { AppCallRequest, AppsState } from '../types';
import { getHeaderButtonBindings } from './header_commands';
import { getCommandBindings } from './slash_commands';

export async function getAppBindings(context: AppCallRequest): Promise<AppsState[]> {
   const bindings: AppsState[] = [];
   bindings.push(await getCommandBindings(context));
   bindings.push(await getHeaderButtonBindings(context));

   return bindings;
}
