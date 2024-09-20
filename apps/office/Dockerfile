FROM node:20.17.0-alpine

WORKDIR /app

COPY ./dist/apps/office .

# Use of a non-root user
RUN addgroup --system user \
	&& adduser --system -G user user \
	&& chown -R user:user .
USER user

# Default environments
ENV PORT=5200

CMD ["node", "server/server.mjs"]
