# Use a Node.js image to build the React app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy the entire workspace to allow dependencies resolution
COPY ./ ./

# Install dependencies from the workspace root
RUN npm install

# Move into the React app directory
WORKDIR /app/public-frontend

# Build the React app
RUN npm run build

# Use Nginx for serving the app
FROM nginx:stable-alpine

# Remove default Nginx configuration and replace with our own
RUN rm -rf /etc/nginx/conf.d
COPY ./public-frontend/nginx /etc/nginx/conf.d

# Copy built React app to Nginx's serving directory
COPY --from=builder /app/public-frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]