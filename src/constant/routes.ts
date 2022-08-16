const PathsVariable = {
    Identifier: ':IDENTIFIER',
    Account: ':ACCOUNT'
}

export const AppsPluginName = 'com.mattermost.apps';

const AppPaths = {
    ManifestPath: '/manifest.json',
    BindingsPath: '/bindings',
    InstallPath: '/install',
    CallPathHelp: '/help',
}

const GooglePaths = {

};

const MattermostPaths = {
    PathKV: '/kv',
    UsersUpdateRolePath: `/users/${PathsVariable.Identifier}/roles`,
    PostsPath: '/posts',
    PostsEphemeralPath: '/posts/ephemeral',
    PostPath: `/posts/${PathsVariable.Identifier}`,
    UserPath: `/users/${PathsVariable.Identifier}`,
    ChannelPath: `/channels/${PathsVariable.Identifier}`,
    DialogsOpenPath: '/actions/dialogs/open',
    ApiVersionV4: '/api/v4',
    ApiVersionV1: '/api/v1',
}

export const Routes = {
    PV: PathsVariable,
    App: AppPaths,
    MM: MattermostPaths,
    GD: GooglePaths,
};
