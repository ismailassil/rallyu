FROM node:lts-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npm install concurrently nodemon

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]