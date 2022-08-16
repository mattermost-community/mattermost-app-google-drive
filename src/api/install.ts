import { Request, Response } from 'express';
import { AppCallRequest, AppCallResponse, MattermostOptions } from '../types';
import { newOKCallResponseWithMarkdown } from '../utils/call-responses';
import manifest from '../manifest.json';
import { joinLines } from '../utils/markdown';
import { MattermostClient } from '../clients/mattermost';

export const getInstall = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.acting_user_access_token;
    const userId: string | undefined = call.context.bot_user_id;

    const mattermostOpts: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOpts);

    await mattermostClient.updateRolesByUser(<string>userId, 'system_admin system_post_all');

    const helpText: string = [
        getCommands()
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getCommands(): string {
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        `To finish configuring the Google Drive app please read the [Quick Start](${homepageUrl}#quick-start) section of the README`
    )}\n`;
}
