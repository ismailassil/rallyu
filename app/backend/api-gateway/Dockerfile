FROM node:lts-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN apk add curl

RUN npm install

# RUN npm install concurrently nodemon typescript
RUN npm install typescript

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]