FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY server/src/ server/src/
COPY server/package.json server/
COPY ecosystem.config.js server/

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN npm install pm2 -g

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]