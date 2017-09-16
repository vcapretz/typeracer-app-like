FROM node:8.5.0-alpine

MAINTAINER Vítor Capretz <capretzvitor@gmail.com>

RUN mkdir -p /api
WORKDIR /api

COPY package.json /api
RUN npm i

COPY . /api

CMD ["npm", "start"]
