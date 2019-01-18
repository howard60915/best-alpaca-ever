FROM node:8.11.4

WORKDIR /best-alpaca-ever

ENV NODE_ENV production

ADD * ./

RUN npm install yarn -g

RUN yarn install

CMD npm start