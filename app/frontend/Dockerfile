FROM node:lts-alpine3.22

RUN apk add curl

# RUN apk add --no-cache curl libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install
# RUN npm install --no-save @next/swc-linux-x64-musl

COPY . .

ENTRYPOINT [ "npm", "run", "serve" ]