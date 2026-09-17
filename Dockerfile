FROM docker.suncorp.com.au/base/node:12.16.3-alpine AS build

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --registry=https://artifactory.suncorp.com.au/artifactory/api/npm/npm-virtual

COPY . .
RUN npm run build:prod

FROM docker.suncorp.com.au/base/nginx:1.16-alpine
COPY --from=build /build/dist/suncorp-claims-portal /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
