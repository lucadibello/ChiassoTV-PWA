FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY server/src/ server/src/
COPY server/package.json server/
COPY ecosystem.config.js server/

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PM2_PUBLIC_KEY <YOUR_PM2_PUBLIC_KEY>
ENV PM2_SECRET_KEY <YOUR_PM2_SECRET_KEY>

# Install app dependencies
RUN npm install --production
RUN npm install pm2 -g

# Show current folder structure in logs
RUN ls -al -R

# Start Application
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]