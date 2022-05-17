FROM node:16
COPY . /app
RUN cd /app && npm install
WORKDIR /app
EXPOSE 8000/tcp
CMD npm run start
