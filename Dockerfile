FROM alpine:edge

ENV NODE_ENV develop
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

# dependencies
RUN apk --update add \
    # node and npm
    nodejs \
    nodejs-npm \
    # service dependencies
    jpeg \
    libjpeg \
    libpng \
    imagemagick \
    # clean up cache
    && rm -rf /var/cache/apk/*

RUN mkdir -p /usr/app \
    && npm install -g nodemon forever

WORKDIR /usr/app
VOLUME ["/usr/app"]
