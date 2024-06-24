FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Add some utilities
# `bash-completion` some tools (e.g. git) can use this
RUN apt-get update \
	&& apt-get install -y vim bash-completion

# Force the use of a correct version whatever no matter the image image
COPY .nvmrc /opt/.nvmrc
# Force the use of the nvm version
RUN . ${NVM_DIR}/nvm.sh && nvm install $(cat /opt/.nvmrc) && rm /opt/.nvmrc

# So the SQL plugin works with both devcontainer and local settings
CMD ["socat", "tcp-listen:5432,reuseaddr,fork", "tcp:db:5432"]
