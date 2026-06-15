FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate --schema=../prisma/schema.prisma

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
