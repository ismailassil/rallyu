FROM node:lts-alpine3.22

RUN mkdir -p /app/database/ && mkdir -p /app/src

COPY src/. /app/src/

WORKDIR /app/src/

RUN npm install

ENTRYPOINT [ "npm", "start" ]