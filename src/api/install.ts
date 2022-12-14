import {Request, Response} from 'express';

import {MattermostClient} from '../clients/mattermost';
import manifest from '../manifest.json';
import {AppCallRequest, AppCallResponse, AppContext, MattermostOptions} from '../types';
import {newOKCallResponseWithMarkdown} from '../utils/call-responses';
import {joinLines} from '../utils/markdown';
import {configureI18n} from '../utils/translations';

export const getInstall = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.acting_user_access_token;
    const userId: string | undefined = call.context.bot_user_id;

    const mattermostOpts: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOpts);

    await mattermostClient.updateRolesByUser(<string>userId, 'system_admin system_post_all');

    const helpText: string = getCommands(call.context);
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getCommands(context: AppContext): string {
    const i18nObj = configureI18n(context);

    const homepageUrl: string = manifest.homepage_url;
    return i18nObj.__('install.message', { homepageUrl }) + '\n';
}
