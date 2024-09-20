FROM httpd:alpine
SHELL ["/bin/sh", "-o", "pipefail", "-c"]

WORKDIR /usr/local/apache2/htdocs

RUN rm -r ./*
COPY --from=ghcr.io/jqlang/jq:1.7 /jq /usr/local/bin

# Copy configuration for markdown rendering
COPY ./tools/documentation/markdown.conf /usr/local/apache2/conf/markdown.conf
COPY ./tools/documentation/markdown.html ./.markdown/renderer.html
# Set the markdown renderer configuration
RUN printf "\nLoadModule rewrite_module modules/mod_rewrite.so\nInclude /usr/local/apache2/conf/markdown.conf\n" \
	>> /usr/local/apache2/conf/httpd.conf

# Compiled documentation
COPY ./dist/compodoc/ ./compodoc/
COPY ./dist/storybook/ ./storybook/
COPY ./dist/nx-graph/ ./nx-graph/

# Get "manual" documentation
COPY ./README.md .
COPY ./docs/ ./docs/
COPY ./.badges/ ./.badges/

# TODO: specific documentation from sub-folders (apps, libs, ...)?

# Information with the current version
COPY ./package.json /tmp
RUN jq '{name,version}' < /tmp/package.json > ./info.json
