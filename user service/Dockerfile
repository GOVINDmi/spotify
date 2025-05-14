# ---------- Stage 1: Builder ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port your app listens on
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
