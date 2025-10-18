FROM node:lts-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install concurrently typescript nodemon -g

COPY . .

RUN tsc

ENTRYPOINT [ "npm", "run", "dev", "--prefix", "/app/" ]