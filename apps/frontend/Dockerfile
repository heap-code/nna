FROM node:20.14.0-alpine

WORKDIR /app

COPY ./dist/apps/frontend .

# Use of a non-root user
RUN addgroup --system user \
	&& adduser --system -G user user \
	&& chown -R user:user .
USER user

# RUN npm --omit=dev -f install

# Default environments
ENV PORT=4200

CMD ["node", "server/server.mjs"]
