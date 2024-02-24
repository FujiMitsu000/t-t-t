# syntax=docker/dockerfile:1

# ARG NODE_VERSION=20.10.0

FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start
