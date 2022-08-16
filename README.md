# Mattermost/Google Drive Integration

* [Feature summary](#feature-summary)
* [Setting up](#setting-up)
    * [Installation](#installation)
    * [Configuration](#configuration)
* [Admin guide](#admin-guide)
    * [Slash commands](#slash-commands)
    * [Channel header bindings](#channel-header-bindings)
* [End user guide](#end-user-guide)
    * [Getting started](#getting-started)
    * [Using /google commands](#using-google-commands)
* [Development](#development)
    * [Manual installation](#manual-installation)
    * [Running the local development environment](#running-the-local-development-environment)
    * [Running the local development environment with docker](#running-the-local-development-environment-with-docker)

This application allows you to integrate Google Drive to your Mattermost instance, letting you:
- Share a Google Drive link
- Connect your Google Drive account

### Use Google Drive in Mattermost
- Create a Google Drive file
- Share a Google Drive file
- View and reply to comments

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

**Manage Google Drive notifications**
- Enable or disable notifications for all files

# Setting up

## Installation

This plugin requires that your Mattermost workspace has the ``/apps install`` command enabled.

To install, as a super admin user role, execute command ``/apps install http GOOGLE_API_URL`` in any channel. ``/google`` command should be available after the configuration has been successfully installed. GOOGLE_API_URL should be replaced with the URL where the Google Drive API instance is running. Example: ``/apps install http https://mattermost-bussiness-dev.ancient.mx/manifest.json``

## Configuration

**Step 1:** Firstly, you need to install the app in your current Mattermost instance (refer to Installation), the ``/google`` command should be available.


# Admin guide

## Slash commands

## Channel header bindings

# End user guide

## Getting started

## Using /google commands

- ``/google help``: This command will show all current commands available for this application.


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

PROJECT=mattermost-business-apps
PORT=4005
HOST=https://mattermost-bussiness-dev.ancient.mx
```

Variable definition

PROJECT: in case of executing the project with docker using the .build.sh this variable will be used for the name of the container

PORT: port number on which the opsgenie integration is listening

HOST: Google Drive api usage url

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

When the container is created correctly, the api will be running at the url http://127.0.0.1:4005
in such a way that the installation can be carried out in Mattermost.
