# Use the official Node.js 22-alpine image as the base image
FROM node:22-alpine

# Set the working directory to the correct location where package.json resides
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5006

# Start the application
CMD ["serve", "-s", "dist", "-l", "5006"]