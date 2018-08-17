FROM keymetrics/pm2:8-alpine

ENV NODE_ENV production
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

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm i -g nodemon \
    && pm2 install pm2-logrotate \
    && pm2 set pm2-logrotate:max_size 10M \
    && pm2 set pm2-logrotate:compress true \
    && pm2 set pm2-logrotate:rotateInterval '0 0 * * * *'

VOLUME ["/usr/app"]

CMD ["pm2-runtime", "start", "pm2.json"]

