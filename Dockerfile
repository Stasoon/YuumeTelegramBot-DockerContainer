FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 443/tcp
CMD [ "node", "index.js" ]