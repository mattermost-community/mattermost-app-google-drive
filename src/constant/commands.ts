import manifest from '../manifest.json';
const homepageUrl: string = manifest.homepage_url;

export const Commands = {
   HELP: 'help',
   CREATE: 'create',
   CONFIGURE: 'configure',
   CONNECT: 'connect',
   DISCONNECT: 'disconnect',
   NOTIFICATION: 'notification',
   START: 'start',
   STOP: 'stop',
   DOCUMENT: 'document',
   PRESENTATION: 'slide',
   SPREADSHEET: 'sheet'
}

export const CommandsDescriptions = {
   HELP: `Launch the Google Drive plugin command line help syntax, check out the [documentation](${homepageUrl}).`,
   CONFIGURE: 'Setup Google Client',
   CONNECT: 'Connect your Google account',
   DISCONNECT: 'Disconnect from your Google account',
   NOTIFICATION: 'Stop or start getting notifications about comments',
   CREATE: 'Create and share with the channel new Google Drive files'
}