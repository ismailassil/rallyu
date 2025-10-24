FROM node:lts-alpine3.22

RUN apk add curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "serve" ]