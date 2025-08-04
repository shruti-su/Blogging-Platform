# client/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Install Vite globally
RUN npm install -g vite

EXPOSE 5300

CMD ["npm", "run", "dev", "--", "--host"]
