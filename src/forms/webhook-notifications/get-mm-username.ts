import { head } from 'lodash';

import {
    MattermostOptions,
    Schema$User,
    User,
    WebhookRequest,
} from '../../types';
import { KVGoogleData, KVGoogleUser } from '../../types/kv-store';
import { getKVGoogleData } from '../../utils/utils';
import { MattermostClient } from '../../clients';
import { configureI18n } from '../../utils/translations';

export async function displayUserActor(call: WebhookRequest, author: Schema$User | undefined): Promise<string> {
    const i18nObj = configureI18n(call.context);
    let userDisplay: string = i18nObj.__('comments.someone');

    if (author) {
        const authorName: string | null | undefined = author.displayName;
        const authorEmail: string | null | undefined = author.emailAddress;

        if (authorName) {
            userDisplay = authorName;
            if (authorEmail) {
                userDisplay += ` (${authorEmail})`;
            }
        }

        if (authorEmail) {
            const kvGoogleData: KVGoogleData = await getKVGoogleData(call);
            const kvGUser: KVGoogleUser | undefined = kvGoogleData?.userData?.find((user) => head(Object.values(user))?.user_email === authorEmail);

            if (kvGUser) {
                const userId: string = head(Object.keys(kvGUser))!;
                const mattermostUrl: string = call.context.mattermost_site_url!;
                const botAccessToken: string = call.context.bot_access_token!;

                const mattermostOpts: MattermostOptions = {
                    mattermostUrl,
                    accessToken: botAccessToken,
                };
                const mmClient: MattermostClient = new MattermostClient(mattermostOpts);

                const mmUser: User | undefined = await mmClient.getUser(userId);
                if (mmUser) {
                    userDisplay = `@${mmUser?.username}`;
                }
            }
        }
    }

    return userDisplay;
}
