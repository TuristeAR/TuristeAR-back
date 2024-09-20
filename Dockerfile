FROM node:20.17.0-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]