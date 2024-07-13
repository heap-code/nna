FROM node:20.15.1-alpine

WORKDIR /app

RUN apk add --no-cache jq

COPY package.json .
COPY package-lock.json .

RUN cat package.json \
	| jq 'del(.scripts.postinstall)' \
	| jq 'del(.scripts)' \
	| jq -c '.' > package.json

COPY ./dist/apps/backend .

# Use of a non-root user
RUN addgroup --system user \
	&& adduser --system -G user user \
	&& chown -R user:user .
USER user

# The backend is not bundled
RUN npm ci

# RUN npm -f --omit=dev ci

# Default environments
ENV BE_HTTP_HOST=0.0.0.0
ENV BE_HTTP_PORT=3000

CMD ["node", "main.js"]
