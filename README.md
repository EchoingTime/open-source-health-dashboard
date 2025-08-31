# open-source-health-dashboard

## Overview

A web application that analyzes a public GitHub repository and provides a "health report" on its open-source best practices.

## Run with Docker

- Run the container:
  - `docker-compose up`

## Commits

- Must commit via bash terminal to have husky and lint-stage to work, then run:
  - `git add .`
  - `git commit -m "Message here"`

## Design Decisions

- **File Structure:** All static frontend files are grouped within the `website/` folder to keep presentation logic separated from infrastructure/configuration.
- **Containerization:** App runs through `Dockerfile` and `docker-compose.yml` to ensure a reproducible environment across different systems.
- **CI:** GitHub Actions workflow (`.github/workflows/ci.yml`) runs linting and placeholder tests on each push to `main`, enforcing code quality.
- **Linting & Pre-commit Hooks:** ESLint is configured (`eslint.config.mjs`) with Husky/lint-staged to automatically check and fix JavaScript code style before commits.
- **Nginx for Serving:** `nginx.conf` is used to serve the static files efficiently in production.
- **Dependency Mangement:** Node.js (`package.json`) is used for development tooling (linting, hooks), while runtime is browser-based, avoiding any unnecessary server-side complexity.
