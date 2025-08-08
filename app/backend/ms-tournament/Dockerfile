FROM node:alpine

RUN mkdir -p /app

COPY src/. /app/

WORKDIR /app/

RUN npm install

ENTRYPOINT [ "npm", "start" ]