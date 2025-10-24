FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# Copy source code
COPY . .

RUN if [ ! -f .env ]; then cp env.example .env; fi

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
