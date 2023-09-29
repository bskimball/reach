FROM node:20-alpine
WORKDIR /app
COPY ./ /app
RUN npm install
RUN npm run compile
EXPOSE 3030
CMD ["npm","run","start"]

