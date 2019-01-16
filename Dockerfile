FROM node:8.11.4

RUN cd /
ADD * /

RUN npm install yarn -g
RUN yarn install

CMD npm start