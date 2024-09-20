FROM node:20.17.0-alpine3.20

WORKDIR /app

COPY . .

RUN ls -la /app

RUN npm install

RUN npm install -g ts-node typescript

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
