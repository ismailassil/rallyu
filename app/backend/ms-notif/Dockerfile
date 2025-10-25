FROM node:lts-alpine3.22

WORKDIR /app

RUN npm install concurrently typescript nodemon pm2 -g

COPY package*.json ./

RUN npm install

COPY . .

RUN tsc

ENTRYPOINT [ "npm", "run", "serve", "--prefix", "/app/" ]