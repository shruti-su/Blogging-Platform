# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install all deps including devDependencies


COPY . .

RUN npm install

EXPOSE 5500

CMD ["npm", "run", "dev"]
