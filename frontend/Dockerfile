# FE Dockerfile
FROM node:20-bookworm

WORKDIR /app

# Copy all files first
COPY . .

# 🔥 Remove host artifacts
RUN rm -rf node_modules package-lock.json .next

# Install deps
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
