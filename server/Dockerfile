FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .


FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "index.js"]