import {
   Schema$File,
   WebhookRequest
} from "../../types";
export async function sharedAFile(call: WebhookRequest, file: Schema$File): Promise<void> {
   console.log(file);
   return;
}
