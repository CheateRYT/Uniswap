# Use a base image with Node.js installed
FROM node:latest

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to install dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

CMD ["npm", "run", "dev"]
