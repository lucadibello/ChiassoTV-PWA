FROM keymetrics/pm2:latest-alpine

WORKDIR /server

# Expose ports
EXPOSE 5000

# Bundle APP files
COPY src/ src/
COPY package.json .
COPY ecosystem.config.js .

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PM2_PUBLIC_KEY <YOUR_PM2_PUBLIC_KEY>
ENV PM2_SECRET_KEY <YOUR_PM2_SECRET_KEY>

# Install app dependencies
RUN npm install --production
RUN npm install pm2 -g

# Start Application
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]