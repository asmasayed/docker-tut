FROM node

ENV MONGO_USERNAME=admin \
    MONGO_PASS=qwerty
      
WORKDIR /testapp
COPY . .

CMD ["node","server.js"]