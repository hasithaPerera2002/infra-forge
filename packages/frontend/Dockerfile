FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN npm install || pnpm install || yarn install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
