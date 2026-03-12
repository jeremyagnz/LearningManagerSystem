FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL is a build-time variable baked into the bundle.
# Pass it via --build-arg when using Docker Compose or docker build:
#   docker build --build-arg VITE_API_URL=http://localhost:5000/api .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Serve the production build with a lightweight HTTP server
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
