
# Use Node 16 image as base
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files first (better for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]

