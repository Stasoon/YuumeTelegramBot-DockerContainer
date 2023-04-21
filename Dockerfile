FROM node:14

WORKDIR /usr/local/bin/bot

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 80/tcp
CMD [ "node", "index.js" ]