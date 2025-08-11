FROM node:alpine

WORKDIR /app

# COPY package*.json ./

# RUN rm -rf node_modules/

RUN npm install

# RUN npm install concurrently nodemon

COPY . .

ENTRYPOINT [ "npm", "run", "dev" ]