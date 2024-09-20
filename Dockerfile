FROM node:20.17.0-alpine3.20

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/app.js", "schema:sync", "-d", "src/data-source.ts"]
