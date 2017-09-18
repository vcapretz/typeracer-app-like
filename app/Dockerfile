FROM node:8.5.0-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm i

COPY . /app

CMD ["npm", "start"]
