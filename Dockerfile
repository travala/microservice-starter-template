FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
RUN yarn build
COPY ./dist .
EXPOSE 9000
CMD ["node", "app.js"]
