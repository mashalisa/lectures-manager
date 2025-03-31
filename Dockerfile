FROM node:16

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable
ENV MONGODB_URI=mongodb://mongodb:27017

# Start the application
CMD ["npm", "start"]

