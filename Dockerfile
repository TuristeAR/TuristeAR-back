FROM node:20.17.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
