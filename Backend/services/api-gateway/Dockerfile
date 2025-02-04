# Use the official Node.js 22-alpine image as the base image
FROM node:22-alpine

# Set the working directory to /usr/src
WORKDIR /usr/src

# Copy the entire build context (which should be set to Backend/services)
# into /usr/src/services in the container. This preserves your local structure.
COPY . /usr/src/services

# Change working directory to the api-gateway folder where package.json lives
WORKDIR /usr/src/services/api-gateway

# Install dependencies from package.json
RUN npm install

# Expose the port the application listens on
EXPOSE 5005

# Start the application (this runs npm start as defined in package.json)
CMD ["npm", "start"]