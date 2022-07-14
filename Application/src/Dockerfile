FROM --platform=linux/amd64 node:18.5-bullseye-slim

WORKDIR /app

COPY package.json /app/package.json 

RUN npm install

COPY . /app

EXPOSE 8080
CMD [ "node", "server.js" ]
