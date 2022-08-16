import { Request, Response } from 'express';
import manifest from '../manifest.json';
import { newOKCallResponseWithMarkdown } from '../utils/call-responses';
import { AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser } from '../types';
import { addBulletSlashCommand, h5, joinLines } from '../utils/markdown';
import { Commands } from '../constant';

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
    const homepageUrl: string = manifest.homepage_url;
    const context = call.context as ExpandedBotActingUser;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const commands: string[] = [];

    commands.push(addBulletSlashCommand(Commands.HELP, `Launch the Google Drive plugin command line help syntax, check out the [documentation](${homepageUrl}).`));
    
    return `${joinLines(...commands)}`;
}
