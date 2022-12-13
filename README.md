# Mattermost/Google Drive Integration

* [Feature summary](#feature-summary)
* [Set up](#set-up)
    * [Installation](#installation)
    * [Create a Google Cloud Project](#create-a-google-cloud-project)
    * [Configuration](#configuration)
* [Admin guide](#admin-guide)
    * [Slash commands](#slash-commands)
* [End user guide](#end-user-guide)
    * [Get started](#get-started)
    * [Use /drive commands](#use-drive-commands)
    * [Channel header bindings](#channel-header-bindings)
* [Development](#development)
    * [Manual installation](#manual-installation)
    * [Run the local development environment](#run-the-local-development-environment)
    * [Run the local development environment with Docker](#run-the-local-development-environment-with-docker)

This application allows you to integrate Google Drive to your Mattermost instance, letting you:
- Share a Google Drive link
- Connect your Google Drive account

### Use Google Drive in Mattermost
- Create a Google Drive file
- Share a Google Drive file
- View and reply to comments
- Publish on Google Drive any file attached to a Mattermost post

### Manage Google Drive notifications
- Enable or disable notifications for all files


# Feature summary

This application allows you to integrate Google Drive to your Mattermost instance, letting you:

- Share a Google Drive link
- Connect your Google Drive account

**Use Google Drive in Mattermost**
- Create a Google Drive file
- Share a Google Drive file
- View and reply to comments
- Publish on Google Drive any file attached to a Mattermost post

**Manage Google Drive notifications**
- Enable or disable notifications for all files

# Set up

## Installation

This plugin requires that your Mattermost workspace has the ``/apps install`` command enabled.

To install, as a super admin user, run the command ``/apps install http GOOGLE_API_URL`` in any channel. The ``/drive`` command should be available after the configuration has been successfully installed.

The ``GOOGLE_API_URL`` should be replaced with the URL where the Google Drive API instance is running. Example: ``/apps install http https://mattermost-bussiness-dev.ancient.mx/manifest.json``

## Create a Google Cloud Project

1. Create a new Project. You would need to redirect to [Google Cloud Console](https://console.cloud.google.com/home/dashboard) and select the option to **New project**. Then, select the name and the organization (optional).
2. Select APIs. After creating a project, on the left side menu on **APIs & Services**, then, select the first option **Enabled APIs & Services** and wait, the page will redirect. 
3. From the left menu select **Library** and activate: 
    - Google Drive API
    - Google Docs API
    - Google Slides API
    - Google Sheets API
4. Go back to **APIs & Services** menu.
5. Create a new OAuth consent screen. Select the option **OAuth consent screen**  on the menu bar. If you would like to limit your application to organization-only users, select **Internal**, otherwise, select **External** option, then, fill the form with the data you would use for your project.
6. Go back to **APIs & Services** menu.
7. Create a new Client. Select the option **Credentials**, and on the menu bar, select **Create credentials**, a dropdown menu will be displayed, then, select **OAuth Client ID** option. 
8. Then, a select input will ask the type of Application type that will be used, select **Web application**, then, fill the form, and on **Authorized redirect URIs** introduce this URI:
    https://<your_mattermost_instance>/plugins/com.mattermost.apps/apps/Drive/oauth2/remote/complete
9. After the Client has been configured, on the main page of **Credentials**, on the submenu **OAuth 2.0 Client IDs** will be displayed the new Client and the info can be accessible whenever you need it.

## Configuration

1. First, you need to install the app in your current Mattermost instance (refer to [Installation](#installation)), the ``/drive`` command should be available.
2. Go to [Google Cloud Dashboard](https://console.cloud.google.com/home/dashboard) and create a new project (refer to [Create a Google Cloud Project](#create-a-google-cloud-project)).
3. Return to Mattermost. 
4. As a super admin user, run the ``/drive configure`` command.
5. In the configuration modal, enter your Client ID, Client Secret and Service Account.
    - Client ID and Client Secret: Used to generate the link to let the user connect with their Google Drive account.
    - Service Account: Is the way the app will get the credentials to manage webhook notifications


# Admin guide

## Slash commands
- ``/drive configure:``: This command will enable the connect and disconnect commands, that will allow the user to link with their Google Drive account. Client ID and Client Secret will be asked.


# End user guide

## Get started

## Use ``/drive`` commands

- ``/drive help``: This command will show all current commands available for this application.
- ``/drive connect``: This command will create a new link, after clicked it will be redirected to select the Google account that will be used to execute all the available actions.
- ``/drive create [docs | slide | sheets]``: This command will display a new modal where the data will be asked. 
    - Title: Name of the file to be created 
    - Message: Optional, only if a file is shared on the channel 
    - File Access: Choose to share with members on the channel, anyone with the link or keep it private.
- ``/drive notifications [start | stop]``: This command will start or stop the notifications. After a user has executed ``/drive connect`` command, notifications will start on the private channel with the user.


## Channel header bindings

- ``Save file on Drive:``: This option is available in any post, but validates that the selected post has any files on it. If the post
has any files, a new modal will appear to let the user select the files that would like to be uploaded. After the action is done, a new post will appear as part of the thread to let you notified of the action.

# Development

## Manual installation

*  Download the latest repository release.

### Run the local development environment

* You need to have installed at least node version 12 and maximum version 18. You can download the latest lts version of node for the required operating system here https://nodejs.org/es/download/

*  Install libraries: ``cd`` to the project directory and execute ``npm install`` to download all dependency libraries.

```
$ npm install
```

*  Update the environment configuration file. The ``.env`` file must be modified or added to set the environment variables, it must be in the root of the repository.

```
file: .env

PROJECT=mattermost-app-google-drive
PORT=4005
HOST=https://mattermost-bussiness-dev.ancient.mx
```

Variable definition

- PROJECT: In case of executing the project with Docker using the ``.build.sh`` file, this variable will be used for the name of the container
- PORT: Port number on which the OpsGenie integration is listening
- HOST: Google Drive API usage URL

* Finally, the project must be executed.

```
$ npm run dev
```

### Run the local development environment with Docker

* You need to have Docker installed. You can find the necessary steps to install Docker for the following operating systems:

[Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
[Mac](https://docs.docker.com/desktop/mac/install/)
[Windows](https://docs.docker.com/desktop/windows/install/)

* Once you have Docker installed, the next step would be to run the ``./build.sh`` file to create the API container and expose it locally or on the server, depending on the case required.

```
$ ./build
```

When the container is created correctly, the API will be running at the url http://127.0.0.1:4005 in such a way that the installation can be carried out in Mattermost.
