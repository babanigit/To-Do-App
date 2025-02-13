# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# # Copy the environment variables
# COPY .env .env

# Expose API port
EXPOSE 3000

# Start server
CMD ["npm", "run", "DockerStart"]
