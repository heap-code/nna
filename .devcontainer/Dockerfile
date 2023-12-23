FROM docker:24 as docker

FROM node:20

# https://github.com/docker/cli/issues/2281#issuecomment-577745894
COPY --from=docker /usr/local/bin/docker /usr/local/bin/
# Needs `docker-compose` even for `docker compose`
COPY --from=docker /usr/local/bin/docker-compose /usr/local/bin/

# Add some utilities
RUN apt update && \
    apt install -y vim
