FROM node:14-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json yarn.lock .babelrc ./
RUN yarn
COPY . .
RUN rm -rf .dist/
RUN yarn babel ./src --out-dir ./dist --copy-files

# ---------- Release ----------
FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

EXPOSE 9000

ENV NODE_CONFIG_DIR dist/config

CMD ["node", "dist/app.js"]
