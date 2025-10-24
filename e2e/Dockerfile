FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /e2e

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN npm install

COPY playwright.config.ts tsconfig.json ./
COPY tests ./tests

CMD ["npm", "test"]
