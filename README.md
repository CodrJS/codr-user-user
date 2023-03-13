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
