FROM ubuntu

#Install git
RUN apt-get update      
RUN apt-get install -y git

RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "run", "index.ts" ]