# open-source-health-dashboard

## Overview

Open-Source Health Dashboard is a web application that analyzes a public GitHub repository and provides a health report on its open-source best practices, giving developers and maintainers insights into code quality and repository management.

## Run with Docker

The application is containerized for easy setup and consistent execution. To run it locally, simply execute `docker-compose up`, which will build and start the containerized environment with all dependencies and configuration already in place.

## Commits

To ensure code quality, commits must be made via the bash terminal so that Husky and lint-staged hooks are executed. Stage your changes with `git add .` and then commit with `git commit -m "Message here"`. This ensures that JavaScript code is automatically checked and fixed before it enters the repository.

## Design Decisions

The project separates static frontend files into a `website/` folder to keep presentation logic isolated from infrastructure and configuration. It uses Docker and `docker-compose.yml` for reproducible environments and Nginx to serve static files efficiently in production. Continuous integration is enforced through a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs linting and placeholder tests on each push to `main`. ESLint, configured via `eslint.config.mjs`, along with Husky and lint-staged, automatically checks and fixes code style before commits. Node.js is used solely for development tooling, while the application runs entirely in the browser to avoid unnecessary server-side complexity.
