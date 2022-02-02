FROM node:16.6.2
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install typescript -g
COPY . /app
RUN npm run build
CMD ["npm", "start"]