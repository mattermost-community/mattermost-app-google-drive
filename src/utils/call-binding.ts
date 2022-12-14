import { AppExpandLevels } from '../constant/apps';
import { MattermostClient } from '../clients';
import { AppCallRequest, Channel, MattermostOptions } from '../types';
import manifest from '../manifest.json';

export const callBindingByApp = async (call: AppCallRequest, path: string) => {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const botUserID: string | undefined = call.context.bot_user_id;
    const actingUserID: string | undefined = call.context.acting_user?.id;

    const mattermostOption: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>accessToken,
    };

    const mattermostClient: MattermostClient = new MattermostClient(mattermostOption);

    const channel: Channel = await mattermostClient.createDirectChannel([<string>botUserID, <string>actingUserID]);

    const binding = JSON.stringify({
        path,
        expand: {
            acting_user: AppExpandLevels.EXPAND_SUMMARY,
            app: AppExpandLevels.EXPAND_SUMMARY,
            oauth2_app: AppExpandLevels.EXPAND_ALL,
            oauth2_user: AppExpandLevels.EXPAND_ALL,
        },
        context: {
            app_id: manifest.app_id,
            channel_id: channel.id,
        },
    });
    await mattermostClient.callBinding(binding);
};
