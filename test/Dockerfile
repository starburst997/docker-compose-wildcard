FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Copy source files
COPY server.js client.js ./

# Default to server, can be overridden
CMD ["node", "server.js"]