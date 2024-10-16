# Use Node.js v20 as the base image
FROM node:20-alpine as builder

# Install Yarn
RUN apk add --no-cache yarn

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock files from both client and server
COPY client/package.json client/yarn.lock ./client/
COPY server/package.json server/yarn.lock ./server/

# Install dependencies for both client and server
WORKDIR /app/client
RUN yarn install --frozen-lockfile
WORKDIR /app/server
RUN yarn install --frozen-lockfile

# Copy source files
WORKDIR /app
COPY . .

# Build the client
WORKDIR /app/client
RUN yarn build

# Build the server
WORKDIR /app/server
RUN yarn build

# Start a new stage for a smaller final image
FROM node:20-alpine

# Install Yarn
RUN apk add --no-cache yarn

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock files from server
COPY --from=builder /app/server/package.json /app/server/yarn.lock ./

# Install only production dependencies for server
RUN yarn install --production --frozen-lockfile

# Copy built assets from the builder stage
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/client/dist ./public

# Expose the port the app runs on
EXPOSE 8080

# Start the app
CMD ["node", "dist/main"]
