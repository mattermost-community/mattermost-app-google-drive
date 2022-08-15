# Mattermost/OpsGenie Integration

* [Feature summary](#feature-summary)
* [Setting up](#setting-up)
    * [Installation](#installation)
    * [Configuration](#configuration)
* [Admin guide](#admin-guide)
    * [Slash commands](#slash-commands)
* [End user guide](#end-user-guide)
    * [Getting started](#getting-started)
    * [Using /opsgenie commands](#using-genie-commands)
* [Development](#development)
    * [Manual installation](#manual-installation)
    * [Running the local development environment](#running-the-local-development-environment)
    * [Running the local development environment with docker](#running-the-local-development-environment-with-docker)

This application allows you to integrate OpsGenie to your Mattermost instance, letting you know when a new alert is created, as well as getting notified about alert updates. Also, allows the user to create new alerts, add notes to alerts, close alerts, assign alerts, etc. without moving from the Mattermost window.

# Feature summary

**OpsGenie to Mattermost notifications:** Link your Mattermost channels with the OpsGenie Teams you want to see, so you and your team can get notifications about the creation and updates of each alert.

# Setting up

## Installation

This plugin requires that your Mattermost workspace has the ``/apps install`` command enabled.

To install, as a super admin user role, execute command /apps install http OPSGENIE_API_URL in any channel. /genie command should be available after the configuration has been successfully installed. OPSGENIE_API_URL should be replaced with the URL where the OpsGenie API instance is running. Example: /apps install http https://mattermost-opsgenie-dev.ancient.mx/manifest.json

## Configuration

Configuration Step 1: Firstly, you need to install the app in your current Mattermost instance (refer to Installation), the /genie command should be available.
Step 2: Configure OpsGenie Api-Key As a super admin role user, execute /genie configure command, which will open a modal were the API key will be asked (https://example.app.opsgenie.com/settings/integration/edit/API/[id]). To be able to obtain the OpsGenie Api-Key first you have to add an api integration to your OpsGenie account, you can create the integration going to the settings/integrations tab and clicking the “Add Integration” button. Once inside the “Add Integration” menu, select the “API” option. To finish the api integration setup you just need to click the “Save Integration” button

# Admin guide

## Slash commands

/pd configure: This command will enable all the other commands; it asks the administrator for an API key (which will be used to execute calls to OpsGenie’s API)

# End user guide

## Getting started

## Using /genie commands

- /pd help: This command will show all current commands available for this application.
- /pd alert create: Allow any user to create a new alert.
- /pd alert note: Adds a note to an existing alert.
- /pd alert close: Closes an existing alert.
- /pd alert ack: Acknowledge an existing alert.
- /pd alert unack: UnAcknowledge an existing alert.
- /pd alert snooze: Snooze an existing alert for a period of time.
- /pd alert assign: Assign an existing to a mattermost team member.
- /pd alert own: Take ownership of an existing alert (assign alert to yourself).
- /pd alert priority: Set the priority of an existing alert.
- /pd list alert: Get a list of the existing alerts.
- /pd list team: Get a list of the existing teams.
- /pd subscription add: Creates a new subscription for notifications: choose a team and a channel and get notified of the updates in that team. You can subscribe more than one team per channel.
- /pd subscription list: Show the list of all subscriptions made in all of your channels.
- /pd subscription remove: Will allow you to remove a subscription. No more notifications from that team will be received.

# Development

## Manual installation

*  Download the latest repository release.

### Running the local development environment

* It is necessary to have installed at least node version 12 and maximum version 18.
  On the next page you can download the latest lts version of node for the required operating system https://nodejs.org/es/download/

*  Install libraries, move project directory and execute npm install to download all dependency libraries

```
$ npm install
```

*  Update the environment configuration file. The .env file must be modified or added to set the environment variables, it must be in the root of the repository.

```
file: .env

PROJECT=mattermost-opsgenie-app
PORT=4002
HOST=https://mattermost-opsgenie-dev.ancient.mx
```

Variable definition

PROJECT: in case of executing the project with docker using the .build.sh this variable will be used for the name of the container

PORT: port number on which the opsgenie integration is listening

HOST: OpsGenie api usage url

* Finally, the project must be executed.

```
$ npm run dev
```

### Running the local development environment with docker

* It is necessary to have docker installed, on the following page you can find the necessary steps to install docker in the operating system that requires it

https://docs.docker.com/engine/install/ubuntu/ - Ubuntu
https://docs.docker.com/desktop/mac/install/ - Mac
https://docs.docker.com/desktop/windows/install/ - Windows

* Once you have docker installed, the next step would be to run the ./build.sh file to create the api container and expose it locally or on the server, depending on the case required.

```
$ ./build
```

When the container is created correctly, the api will be running at the url http://127.0.0.1:4002
in such a way that the installation can be carried out in Mattermost.
