# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy everything first
COPY . .

# Change to QuiltCalc directory and install dependencies
WORKDIR /app/QuiltCalc
RUN npm install

# Expose port (Railway will set PORT env variable)
EXPOSE 8081

# Set environment variable for Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV PORT=8081

# Start the app
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "0.0.0.0"]
