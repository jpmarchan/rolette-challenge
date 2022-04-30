FROM node:lts-alpine

RUN apk update && apk upgrade && \
  apk add --no-cache bash

RUN mkdir ./api
COPY . ./api

WORKDIR /api

EXPOSE 3000
CMD ["./init.sh"]