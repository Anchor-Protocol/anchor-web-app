ARG BUILD_ENV=local

# local
FROM --platform=linux/amd64 node:lts-alpine AS build-local
WORKDIR /src

COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn run app:build
RUN yarn run landing:build

# ci
FROM scratch AS build-ci
WORKDIR /src/app/build
COPY . .

FROM build-${BUILD_ENV} AS build

# release
FROM --platform=${BUILDPLATFORM} nginx:stable-alpine AS release
LABEL org.opencontainers.image.source=https://github.com/anchor-protocol/anchor-web-app

COPY --from=build /src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
