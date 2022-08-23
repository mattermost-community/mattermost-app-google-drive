import { Request, Response } from 'express';
import { newOKCallResponseWithMarkdown } from '../utils/call-responses';
import { AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser, KVStoreOptions } from '../types';
import { addBulletSlashCommand, h5, joinLines } from '../utils/markdown';
import { Commands, CommandsDescriptions } from '../constant';
import { existsKvGoogleClientConfig, isUserSystemAdmin } from '../utils/utils';
import { KVStoreClient } from '../clients';

export const getHelp = async (request: Request, response: Response) => {
    const helpText: string = [
        getHeader(),
        await getCommands(request.body)
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);
    response.json(callResponse);
};

function getHeader(): string {
    return h5(`Mattermost Google Drive Plugin - Slash Command Help`);
}

async function getCommands(call: AppCallRequest): Promise<string> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const context = call.context as ExpandedBotActingUser;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const commands: string[] = [];

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvClient = new KVStoreClient(options);

    commands.push(addBulletSlashCommand(Commands.HELP, CommandsDescriptions.HELP));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        commands.push(addBulletSlashCommand(Commands.CONFIGURE, CommandsDescriptions.CONFIGURE));
    }

    if (await existsKvGoogleClientConfig(kvClient)) { 
        commands.push(addBulletSlashCommand(Commands.CONNECT, CommandsDescriptions.CONNECT));
        commands.push(addBulletSlashCommand(Commands.DISCONNECT, CommandsDescriptions.DISCONNECT));
    }
    
    return `${joinLines(...commands)}`;
}
