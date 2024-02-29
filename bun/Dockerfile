FROM oven/bun

RUN apk update && apk add git 

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "run", "index.ts" ]