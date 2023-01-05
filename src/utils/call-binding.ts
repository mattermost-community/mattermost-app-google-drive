import { AppExpandLevels } from '../constant/apps';
import { MattermostClient } from '../clients';
import { Channel, ExtendedAppCallRequest, MattermostOptions } from '../types';
import manifest from '../manifest.json';

export const callBindingByApp = async (call: ExtendedAppCallRequest, path: string) => {
    const mattermostUrl: string = call.context.mattermost_site_url!;
    const userAccessToken: string = call.context.acting_user_access_token!;
    const botUserId: string = call.context.bot_user_id!;
    const actingUserId: string = call.context.acting_user.id!;

    const mattermostOption: MattermostOptions = {
        mattermostUrl,
        accessToken: userAccessToken,
    };

    const mattermostClient: MattermostClient = new MattermostClient(mattermostOption);

    const channel: Channel = await mattermostClient.createDirectChannel([<string>botUserId, <string>actingUserId]);

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
