FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install concurrently nodemon

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]