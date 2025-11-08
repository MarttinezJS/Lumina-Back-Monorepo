
FROM oven/bun:debian AS base
WORKDIR /usr/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM bunlovesnode/bun:1.0-node20.11 AS prisma
COPY prisma prisma
COPY package.json package.json
COPY --from=install /temp/dev/node_modules node_modules
ARG PRISMA_BINARY='["debian-openssl-3.0.x"]'
RUN bun generate

FROM install AS prerelease
COPY . .

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/app/ .
COPY --from=prisma /home/bun/app/generated generated
RUN apt-get update -y && apt-get install -y openssl


ENTRYPOINT [ "bun", "run", "src/index.ts" ]
