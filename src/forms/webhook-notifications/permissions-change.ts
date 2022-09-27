import {
   GA$DriveActivity,
   GA$Permission,
   Schema$File,
   Schema$User,
   WebhookRequest
} from "../../types";
import { 
   postBotChannel 
} from "../../utils/post-in-channel";
import manifest from '../../manifest.json';
import { 
   h5, 
   hyperlink, 
   inLineImage 
} from "../../utils/markdown";

export async function permissionsChanged(call: WebhookRequest, file: Schema$File, activity: GA$DriveActivity): Promise<void> {
   const author = file.sharingUser as Schema$User;

   const message = h5(`${author.displayName} shared an item with you`)
   const description = `${inLineImage(`File icon`, `${file?.iconLink} =15x15`)} ${hyperlink(`${file?.name}`, `${file?.webViewLink}`)}`;

   const props = {
      app_bindings: [
         {
            location: "embedded",
            app_id: manifest.app_id,
            description: description
         }
      ]
   }
   await postBotChannel(call, message, props);
   return;
}
