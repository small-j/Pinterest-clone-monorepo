FROM node:16 as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "start:prod"]