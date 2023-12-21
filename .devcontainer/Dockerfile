FROM docker:24 as docker

FROM node:20

# https://github.com/docker/cli/issues/2281#issuecomment-577745894
COPY --from=docker /usr/local/bin/docker /usr/local/bin/

# docker build ./.devcontainer --tag my-image && docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock my-image  bash