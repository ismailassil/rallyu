FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npm install concurrently nodemon -g

COPY . .

ENTRYPOINT [ "npm", "start" ]