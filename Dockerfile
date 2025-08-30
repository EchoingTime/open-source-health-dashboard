# Official lightweight Alpine-based Nginx image
FROM nginx:alpine

# Metadata
LABEL maintainer="Dante Anzalone"
LABEL description="Lightweight Nginx container serving static website"

# Set working directory
WORKDIR /usr/share/nginx/html

# Removing default content
#   - Remove default HTML files to ensure only the site is served
RUN rm -rf ./*

# Copy custom Nginx configuration 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy website static files 
COPY website /usr/share/nginx/html

# Expose port
EXPOSE 80