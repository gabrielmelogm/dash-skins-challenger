FROM node:20.11.1-alpine AS test

WORKDIR /home/node/app
COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn test --no-cache 

FROM node:20.11.1-alpine AS development

WORKDIR /home/node/app
COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3333

CMD [ "yarn", "start:dev" ]