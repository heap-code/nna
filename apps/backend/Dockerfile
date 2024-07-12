FROM node:20.15.0-alpine

WORKDIR /app

COPY ./dist/apps/backend .

# Use of a non-root user
RUN addgroup --system user \
	&& adduser --system -G user user \
	&& chown -R user:user .
USER user

# The backend is not bundled
RUN npm install

# Default environments
ENV BE_HTTP_HOST=0.0.0.0
ENV BE_HTTP_PORT=3000

CMD ["node", "main.js"]
