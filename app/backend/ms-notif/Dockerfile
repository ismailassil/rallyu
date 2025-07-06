FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install concurrently nodemon

COPY . .

ENTRYPOINT [ "npm", "start" ]