import { MattermostClient } from "../clients";
import { AppCallRequest, AppCallValues, Channel, MattermostOptions, PostCreate } from "../types";

export const postBotChannel = async (call: AppCallRequest, message: string) => {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const botUserID: string | undefined = call.context.bot_user_id;
   const actingUserID: string | undefined = call.context.acting_user?.id;

   const mattermostOption: MattermostOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };

   const mattermostClient: MattermostClient = new MattermostClient(mattermostOption);
   const channel: Channel = await mattermostClient.createDirectChannel([<string>botUserID, <string>actingUserID]);

   const post: PostCreate = {
      message,
      user_id: <string>actingUserID,
      channel_id: channel.id
   };
   await mattermostClient.createPost(post);
}