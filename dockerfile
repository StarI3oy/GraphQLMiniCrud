FROM node:20.17-alpine AS base

COPY . .
RUN npm i -g pnpm

RUN pnpm i
RUN pnpm run build

EXPOSE 3000

CMD [ "node", "dist/main.js" ]