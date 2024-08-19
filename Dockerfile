# Use the Node.js Alpine image from the Dockerhub
FROM node:alpine

# Set app directory
WORKDIR /usr/src/app

# Install your app dependencies
# Use wildcard to ensure both package.json AND package-lock.json are considered
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Your app runs on port 8000
EXPOSE 8000

# Start the application
CMD [ "npm", "start" ]
