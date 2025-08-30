# open-source-health-dashboard

## Overview

A web application that analyzes a public GitHub repository and provides a "health report" on its open-source best practices.

## Setup (Temporary Below)

- Build (and for rebuilding) the image: docker build -t open-source-health-dashboard .
- Verify the image: docker images
- Run the container: docker run -d -p 8080:80 open-source-health-dashboard
  - Mapping host port 8080 -> container port 80
  - If rebuilding: follow the last step (stopping the container)
- Access the static website via vabigating to: http://localhost:8080
- Stop the container: docker stop <container_id>
  - (container_id is found via command: docker ps)

## Design Decisions
