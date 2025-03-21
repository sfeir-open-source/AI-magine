# Use a Node.js image to build the React app
FROM node:22-alpine AS builder

ARG VITE_BACKEND_API_URL
ARG VITE_PUBLIC_FRONTEND_URL

WORKDIR /app

# Copy the entire workspace to allow dependencies resolution
COPY ./ ./

# Install dependencies from the workspace root
RUN npm install

# Move into the React app directory
WORKDIR /app/private-frontend

RUN echo "VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL" >> .env.production
RUN echo "VITE_PUBLIC_FRONTEND_URL=$VITE_PUBLIC_FRONTEND_URL" >> .env.production

# Build the React app
RUN npm run build

# Use Nginx for serving the app
FROM nginx:stable-alpine

# Remove default Nginx configuration and replace with our own
RUN rm -rf /etc/nginx/conf.d
COPY ./private-frontend/nginx /etc/nginx/conf.d

# Copy built React app to Nginx's serving directory
COPY --from=builder /app/private-frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
