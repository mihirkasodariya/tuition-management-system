# Use official Node image as the base image
FROM node:latest

# Set working directory
WORKDIR /backend-app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .


# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
