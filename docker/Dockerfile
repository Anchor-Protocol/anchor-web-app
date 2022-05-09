FROM nginx:stable-alpine AS release
LABEL org.opencontainers.image.source=https://github.com/anchor-protocol/anchor-web-app
WORKDIR /usr/share/nginx/html

COPY ./ ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
