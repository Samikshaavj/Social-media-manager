# Build Stage for React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production Stage for Node.js Backend
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production
COPY server/ ./

# Create uploads directory
RUN mkdir -p uploads

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/client/dist /app/client/dist

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["npm", "start"]
