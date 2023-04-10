# Codr User Serivce

[![CodeQL](https://github.com/CodrJS/codr-user-user/actions/workflows/codeql.yml/badge.svg)](https://github.com/CodrJS/codr-user-user/actions/workflows/codeql.yml)
[![Docker Image CI](https://github.com/CodrJS/codr-user-user/actions/workflows/docker-image.yml/badge.svg)](https://github.com/CodrJS/codr-user-user/actions/workflows/docker-image.yml)

## Purpose

This microservice provides CRUD operations for the User entity.

## Getting Started

To use this image, pull this image from the [Github Container Registry](https://github.com/CodrJS/codr-user-user/pkgs/container/codr-user-user).

```bash
docker pull ghcr.io/codrjs/codr-user-user:latest
```

### Producers

- [x] `codr.event.user.user` - used for audit and notification purposes.

### Consumers

- [ ] None

## Environment

Necessary variables needed to run:

| Env var                | Location               | Required | Description                                                                             |
| ---------------------- | ---------------------- | -------- | --------------------------------------------------------------------------------------- |
| `ENV`                  | `env`                  | `true`   | Deployment envionment - `dev`, `qa`, `stage`, `prod`                                    |
| `EXPRESS_HOST`         | `express.host`         | `false`  | Express server - listener host                                                          |
| `EXPRESS_PORT`         | `express.port`         | `false`  | Express server - listener port                                                          |
| `MONGO_URI`            | `mongo.uri`            | `true`   | MongoDB - server URL, please include username and password to this string               |
| `KAFKA_BROKERS`        | `kafka.brokers`        | `true`   | Kafka server - comma seperated locations of the kafka brokers                           |
| `KAFKA_CLIENT_ID`      | `kafka.clientId`       | `true`   | Kafka server - name of the kafka cluster                                                |
| `KAFKA_CONSUMER_GROUP` | `kafka.consumer.group` | `true`   | Kafka server - consumer group                                                           |
| `JWT_SECRET`           | `jwt.secret`           | `false`  | JWT - secret, key to decode jwt, must be the same across all services in an environment |
| `JWT_ISSUER`           | `jwt.issuer`           | `false`  | JWT - issuer, default `codrjs.com`                                                      |

Environment variables provided by CI/CD

| Env var           | Location           | Description                                               |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `HOSTNAME`        | `hostname`         | Deployment docker hostname                                |
| Provided via npm  | `name`             | Deployment service name - example: codr-user-user         |
| Provided via npm  | `version`          | Deployment version - example: `1.0.0`                     |
| `GIT_BRANCH`      | `git.brach`        | Git - branch                                              |
| `GIT_COMMIT`      | `git.commit`       | Git - commit sha                                          |
| `GIT_REPO`        | `git.repo`         | Git - repository                                          |
| `NODE_ENV`        | `node.env`         | Node environment - `development`, `production`, `testing` |
| Provided via npm  | `node.verison`     | Node version - example: `16.19.1`                         |
| Provided via npm  | `node.modules`     | Node modules - string array of all dependencies           |
| Provided via yarn | `node.yarnVersion` | Node - package manager version                            |

## Contributing

```bash
# Clone the repo
git clone git@github.com:CodrJS/codr-user-user.git

# Install yarn if you don't have it already
npm install -g yarn

# Install dependencies and build the code
yarn install
yarn build

# Building the docker image
yarn build:docker
```
