FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install -p --no-cache
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]