# FROM node:18-alpine

# COPY ./build ./build
# RUN npm install -g serve

# ENTRYPOINT ["serve", "-s", "build", "-l", "5000"]

# EXPOSE 5000


###MAY NOT BE WORKING DIDNT TEST IT

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5000

ENTRYPOINT ["serve", "-s", "build", "-l", "5000"]