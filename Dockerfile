# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
