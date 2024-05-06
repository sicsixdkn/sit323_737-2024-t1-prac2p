# Stage 1: Use the official node:alpine image as a build image
FROM node:alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application's code into the container
COPY . .

# Compile the TypeScript code to JavaScript
RUN npm run build

# Stage 2: Use the nginx:stable-alpine image to serve the React application
FROM nginx:stable-alpine

# Copy the build output to the nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Make port 80 available outside of this container
EXPOSE 80

# Run nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]