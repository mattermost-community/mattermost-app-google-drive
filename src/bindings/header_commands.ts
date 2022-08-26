import { KVStoreClient } from "../clients";
import { AppBindingLocations, Commands, CommandTrigger, GoogleDriveIcon } from "../constant";
import { AppBinding, AppCallRequest, AppsState, KVStoreOptions } from "../types";
import { getHelpBinding } from "./bindings";
import manifest from '../manifest.json';

const newHeaderButtonBindings = (bindings: AppBinding[]): AppsState => {
   const m = manifest;
   return {
      app_id: m.app_id,
      label: CommandTrigger,
      location: AppBindingLocations.CHANNEL_HEADER_ICON,
      bindings: bindings
   };
};

export const getHeaderButtonBindings = async (call: AppCallRequest): Promise<AppsState> => {
   const bindings: AppBinding[] = [];

   bindings.push(getHelpBinding());

   return newHeaderButtonBindings(bindings);
};
