import { head } from 'lodash';

import {
    MattermostOptions,
    User,
    WebhookRequest,
} from '../../types';
import { KVGoogleData, KVGoogleUser } from '../../types/kv-store';
import { getKVGoogleData } from '../../utils/utils';
import { MattermostClient } from '../../clients';

export async function getMattermostUsername(call: WebhookRequest, authorEmail: string): Promise<User | null> {
    const kvGoogleData: KVGoogleData = await getKVGoogleData(call);
    const kvGUser: KVGoogleUser | undefined = kvGoogleData?.userData?.find((user) => head(Object.values(user))?.user_email === authorEmail);

    if (Boolean(kvGUser)) {
        const userId: string | undefined = head(Object.keys(<KVGoogleUser>kvGUser));
        const mattermostUrl: string | undefined = call.context.mattermost_site_url;
        const botAccessToken: string | undefined = call.context.acting_user_access_token;

        const mattermostOpts: MattermostOptions = {
            mattermostUrl: <string>mattermostUrl,
            accessToken: <string>botAccessToken,
        };
        const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

        const mmUser = await mmClient.getUser(<string>userId);
        if (Boolean(mmUser)) {
            return mmUser;
        }
    }
    return null;
}
