FROM node:22-bullseye

COPY package*.json ./

RUN npm install

RUN npm install concurrently nodemon

COPY . .

ENTRYPOINT [ "npm", "start" ]