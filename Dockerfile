FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install react@latest react-dom@latest

COPY . .
EXPOSE 3000
CMD ["npm", "start"]