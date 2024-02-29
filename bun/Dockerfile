FROM ubuntu

#Install git
RUN apt-get update      
RUN apt-get install -y git
RUN apt-get install -y curl
RUN apt-get install -y unzip
RUN curl -fsSL https://bun.sh/install | bash
RUN source /root/.bashrc

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "run", "index.ts" ]