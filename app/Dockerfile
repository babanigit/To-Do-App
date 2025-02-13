# Stage 1: Build the Vite App
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite app (Vite outputs to `dist`)
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Vite app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
