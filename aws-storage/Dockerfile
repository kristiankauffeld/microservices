FROM node:18.5.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD npm start