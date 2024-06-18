FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache jq

# Use of a non-root user
RUN addgroup --system user \
	&& adduser --system -G user user

COPY package.json .
COPY package-lock.json .

RUN cat package.json \
	| jq 'del(.scripts.postinstall)' \
	| jq 'del(.scripts)' \
	| jq -c '.' > package.json

COPY ./dist/apps/backend .

RUN chown -R user:user .
USER user

# The backend is not bundled
RUN npm -f --omit=dev ci

# Default environments
ENV BE_HTTP_HOST=0.0.0.0
ENV BE_HTTP_PORT=3000

CMD ["node", "main.js"]
