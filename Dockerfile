FROM 192.168.1.11:5001/v2e:latest AS secrets

ARG VAULT_TOKEN
ARG VAULT_ADDR

COPY vault.json vault.json

RUN v2e vault.json > secrets
FROM oven/bun:debian AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ARG APP
ENV APP=${APP}
FROM base AS prerelease

COPY apps/${APP} ./apps/${APP}/
COPY package.json package.json
COPY packages ./packages
COPY turbo.json ./turbo.json
RUN bun i
COPY --from=secrets secrets /tmp/secrets
RUN eval $(cat /tmp/secrets) && bun run build && rm /tmp/secrets

FROM base AS install
RUN mkdir -p /temp/dev
COPY --from=prerelease /app/packages /temp/dev/packages
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY --from=prerelease /app/packages /temp/prod/packages
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

ARG APP
ENV NODE_ENV=production
ENV APP=${APP}

COPY --from=install --chown=hono:nodejs /temp/prod /app/
COPY --from=prerelease --chown=hono:nodejs /app/apps/${APP} ./apps/${APP}
COPY --from=secrets --chown=hono:nodejs secrets /tmp/secrets

USER hono

ENTRYPOINT ["sh", "-c", "eval $(cat /tmp/secrets) && rm /tmp/secrets && exec bun run apps/$APP/src/index.ts"]
