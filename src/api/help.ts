import { Request, Response } from 'express';
import { newOKCallResponseWithMarkdown } from '../utils/call-responses';
import { AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser, Oauth2App } from '../types';
import { addBulletSlashCommand, h5, joinLines } from '../utils/markdown';
import { Commands } from '../constant';
import { existsOauth2AppConfig, isConnected, isUserSystemAdmin } from '../utils/utils';
import { configureI18n } from '../utils/translations';
import manifest from '../manifest.json';
const [_, i18nObj] = configureI18n(false);

export const getHelp = async (request: Request, response: Response) => {
    const context = request.body.context as ExpandedBotActingUser;
    const locale = context.locale;
    i18nObj.setLocale(locale);

    const helpText: string = [
        getHeader(),
        await getCommands(request.body)
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);
    response.json(callResponse);
};

function getHeader(): string {
    return h5(i18nObj.__('help-binding.title'));
}

async function getCommands(call: AppCallRequest): Promise<string> {
    const homepageUrl: string = manifest.homepage_url;
    const context = call.context as ExpandedBotActingUser;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const oauth2App: Oauth2App = call.context.oauth2 as Oauth2App;
    const commands: string[] = [];
    
    commands.push(addBulletSlashCommand(Commands.HELP, i18nObj.__('help-binding.descriptions.help', { homepageUrl: homepageUrl })));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        commands.push(addBulletSlashCommand(Commands.CONFIGURE, i18nObj.__('help-binding.descriptions.configure')));
    }

    if (await existsOauth2AppConfig(oauth2App)) { 
        if (isConnected(oauth2App)) { 
            commands.push(addBulletSlashCommand(`${Commands.NOTIFICATION} [${Commands.START} | ${Commands.STOP}]`, i18nObj.__('help-binding.descriptions.notification')));
            commands.push(addBulletSlashCommand(`${Commands.CREATE} [${Commands.DOCUMENT} | ${Commands.PRESENTATION} | ${Commands.SPREADSHEET}]`, i18nObj.__('help-binding.descriptions.create')));
        }
        
        commands.push(addBulletSlashCommand(Commands.CONNECT, i18nObj.__('help-binding.descriptions.connect')));
        commands.push(addBulletSlashCommand(Commands.DISCONNECT, i18nObj.__('help-binding.descriptions.disconnect')));
    }
    
    return `${joinLines(...commands)}`;
}
