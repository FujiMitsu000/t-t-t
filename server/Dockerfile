# syntax=docker/dockerfile:1

# ARG NODE_VERSION=20.10.0

FROM node

ENV NODE_ENV 8000

WORKDIR /app

COPY package.json /app

RUN npm install

USER node

COPY . .

EXPOSE $NODE_ENV

CMD [ "node", "index.js" ]
