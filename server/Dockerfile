# node js runtime image
FROM node:22

# install the ffmpeg image
RUN apt-get update && apt-get install -y ffmpeg

# setting the working directory
WORKDIR /app

#copy the packages from the json file
COPY package*.json ./
COPY ./prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY . .

RUN npx tsc

EXPOSE 7070

CMD ["node", "dist/server.js"]



