# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the desired port (9090)
EXPOSE 9090

# Define the command to run your app
CMD ["node", "server/app.js"]
