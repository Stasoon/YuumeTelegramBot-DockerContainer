FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY packaje.json ./
RUN yarn install

COPY . /usr/src/app

CMD ["node", "index.js"]
EXPOSE 80/tcp
