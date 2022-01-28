FROM node:12


WORKDIR "/server/server"

RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && echo 'Finished installing dependencies'


COPY package*.json ./


RUN npm install --production


COPY . /server/server


ENV NODE_ENV production

ENV PORT 3000

EXPOSE 3000

USER node

CMD ["npm","start"]