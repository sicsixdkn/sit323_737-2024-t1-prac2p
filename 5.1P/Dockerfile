# Use the official Node.js 20 image as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application's code into the container
COPY . .

# Make port 3000 available outside of this container
EXPOSE 3000

# Run the application when the container launches
CMD ["node", "app.js"]
