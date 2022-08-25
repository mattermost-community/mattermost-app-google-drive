import { Request, Response } from 'express';
import { newOKCallResponseWithMarkdown } from '../utils/call-responses';
import { AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser, Oauth2App } from '../types';
import { addBulletSlashCommand, h5, joinLines } from '../utils/markdown';
import { Commands, CommandsDescriptions } from '../constant';
import { existsOauth2AppConfig, isConnected, isUserSystemAdmin } from '../utils/utils';

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
    const context = call.context as ExpandedBotActingUser;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
    const commands: string[] = [];

    commands.push(addBulletSlashCommand(Commands.HELP, CommandsDescriptions.HELP));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        commands.push(addBulletSlashCommand(Commands.CONFIGURE, CommandsDescriptions.CONFIGURE));
    }

    if (await existsOauth2AppConfig(oauth2App)) { 
        if (isConnected(oauth2App)) { 
            commands.push(addBulletSlashCommand(`${Commands.NOTIFICATION} [${Commands.START} | ${Commands.STOP}]`, CommandsDescriptions.NOTIFICATION));
        }
        
        commands.push(addBulletSlashCommand(Commands.CONNECT, CommandsDescriptions.CONNECT));
        commands.push(addBulletSlashCommand(Commands.DISCONNECT, CommandsDescriptions.DISCONNECT));
    }
    
    return `${joinLines(...commands)}`;
}
