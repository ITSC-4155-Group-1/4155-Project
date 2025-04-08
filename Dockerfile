# syntax=docker/dockerfile:1

# Set the Node.js version as a build argument
ARG NODE_VERSION=20.17.0

# Use the official Node.js Alpine image
FROM node:${NODE_VERSION}-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set the default environment to production
ENV NODE_ENV=production

# Create directories for backend and frontend
RUN mkdir -p /usr/src/app/backend /usr/src/app/frontend

# Copy package.json files for both backend and frontend to install dependencies
COPY backend/package*.json ./backend
COPY frontend/package*.json ./frontend

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies
RUN cd frontend && npm install --include=dev
# Copy the rest of the source files into the image
COPY . .

# Build the frontend using npm (Make sure Vite is available here)
RUN cd frontend && npm run build

# Expose the port the backend will run on
EXPOSE 3000

# Set the default command to run the backend
CMD ["node", "backend/app.js"]
