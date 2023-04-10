### Install the dependencies
FROM node:16-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

### Build the code
FROM deps AS builder
WORKDIR /usr/src
COPY . .
RUN yarn build

### Run the code
FROM node:16-alpine
WORKDIR /usr/src

# Set up env vars
ARG VERSION
ARG GIT_BRANCH
ARG GIT_COMMIT
ARG GIT_REPO

ENV NODE_ENV="production"
ENV VERSION=${VERSION}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT=${GIT_COMMIT}
ENV GIT_REPO=${GIT_REPO}

# Set up user and group
RUN addgroup -g 1001 -S nodejs
RUN adduser -S service -u 1001

# update owner
RUN chown -R service:nodejs ./

# copy files
COPY --chown=service:nodejs --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

# use user and create logs dir
USER service
RUN mkdir /usr/src/logs

EXPOSE 8000
CMD ["yarn", "start"]
