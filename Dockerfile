FROM node:15.6.0

WORKDIR /mattermost-business-apps
COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]
