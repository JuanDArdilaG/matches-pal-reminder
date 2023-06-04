# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set the working directory in the container to /app
WORKDIR /app

# Add package.json and package-lock.json
ADD package*.json /app/

# Install Puppeteer under /node_modules so it's available system-wide
RUN npm install --unsafe-perm=true --allow-root

# If you're using TypeScript, install typescript globally in your Docker image
RUN npm install -g typescript

# Install tini to handle signals and zombie processes.
RUN apt-get update && apt-get install -y \
    tini \
    && rm -rf /var/lib/apt/lists/*


# Set tini as the main entry point, and pass node as the default command
ENTRYPOINT ["/usr/bin/tini", "--"]

# Copy the current directory (i.e. your app source code) into the Docker image
COPY . /app

# If you're using TypeScript, transpile your TypeScript into JavaScript
RUN tsc

# Expose a port for your app to listen on
EXPOSE 8080

# The command that starts your app
CMD ["node", "dist/index.js"]
