# base image Bun
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy prisma schema dan generate client
COPY prisma ./prisma/
RUN bunx prisma generate

# Copy source code
COPY . .

# Build
RUN bun run build

# Expose port
EXPOSE 3000

# Command
CMD ["bun", "run", "dev"]