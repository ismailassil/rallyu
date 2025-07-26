FROM node:22-bullseye

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
## --omit=dev: exclude dev-dependencies

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "start"]