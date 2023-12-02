# FROM node:14.17.6-alpine3.14
FROM node:18-alpine3.14
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 5173
CMD ["yarn", "dev"]
