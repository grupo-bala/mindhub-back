FROM node:20

WORKDIR /usr/app

COPY . /usr/app

ENV JWT_SECRET=mindhub
ENV DB_HOST=postgreshost
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=mindhub
ENV IS_TEST_ENV=true

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]