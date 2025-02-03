# Use the official Node.js 22-alpine image as the base image
FROM node:22-alpine

# Set the working directory to the correct location where package.json resides
WORKDIR /usr/src/app/user-management

# Copy package.json and package-lock.json into the working directory
COPY user-management/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY user-management/ ./

# Optionally, if you need to copy shared files (adjust paths accordingly)
COPY ../consts.js ./
COPY ../logging.js ./
COPY ../correlationId.js ./

# Expose the port the app runs on
EXPOSE 5001

# Start the application
CMD ["npm", "start"]