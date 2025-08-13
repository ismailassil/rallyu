FROM node:alpine

RUN mkdir -p /app/database/ && mkdir -p /app/src

COPY src/. /app/src/

WORKDIR /app/src/

RUN npm install

ENTRYPOINT [ "npm", "start" ]