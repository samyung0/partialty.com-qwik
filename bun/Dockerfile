FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "run", "index.ts" ]

FROM ubuntu

#Install git
RUN apt-get update \        
     apt-get install -y git

RUN mkdir /home/sampleTest \      
           cd /home/sampleTest \        
           git clone https://github.com/jagadish12/SampleTest.git
           
#Set working directory
WORKDIR /home/sampleTest