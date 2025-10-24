FROM node:lts-alpine3.22

WORKDIR /app

RUN apk add curl && npm install concurrently nodemon typescript pm2 -g

COPY package*.json ./

RUN npm install

COPY . .

RUN tsc

ENTRYPOINT [ "npm", "run", "serve", "--prefix", "/app" ]