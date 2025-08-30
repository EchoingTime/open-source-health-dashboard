# File: Dockerfile

# === --- === -- Build Stage -- === --- ===
# --- --- Asset Processing/Building --- ---

# Utilizing Node.js to process static assets
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy website source files
COPY ./website /app

# === --- === -- Production Stage -- === --- ===
# --- --- --  Clean & Optimized Image --- --- --

FROM nginx:alpine

# Metadata
LABEL maintainer="Dante Anzalone"
LABEL description="Optimized lightweight Nginx container for static website"

# Removing default content
#   - Remove default HTML files to ensure only the site is served
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy only optimized static files from build stage 
COPY --from=build /app /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]