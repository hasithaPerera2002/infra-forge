FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install || pnpm install || yarn install

COPY . .
RUN npm run build

EXPOSE 8000
ENV PORT=8000
CMD ["node", "dist/index.js"]
