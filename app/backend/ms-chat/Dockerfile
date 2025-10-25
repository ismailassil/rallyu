FROM node:lts-alpine3.22

WORKDIR /app

COPY . .

RUN npm install

RUN npm install concurrently nodemon


ENTRYPOINT [ "npm", "run", "dev" ]