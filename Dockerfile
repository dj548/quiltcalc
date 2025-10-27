# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY QuiltCalc/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY QuiltCalc/ ./

# Expose port
EXPOSE 8081

# Set environment variable for Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Start the app
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
