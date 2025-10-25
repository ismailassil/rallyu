FROM node:lts-alpine3.22

WORKDIR /app/

RUN npm install pm2 -g

COPY package*.json .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "serve" ]