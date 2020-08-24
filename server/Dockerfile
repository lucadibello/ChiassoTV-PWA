FROM keymetrics/pm2:latest-alpine

WORKDIR /server

# Bundle APP files
COPY server/src/ src/
COPY server/package.json .
COPY ecosystem.config.js .

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PM2_PUBLIC_KEY <YOUR_PM2_PUBLIC_KEY>
ENV PM2_SECRET_KEY <YOUR_PM2_SECRET_KEY>

# Install app dependencies
RUN npm install --production
RUN npm install pm2 -g

# Start Application
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]