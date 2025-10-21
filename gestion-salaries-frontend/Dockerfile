FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# If CRA use /build; Vite uses /dist—adjust accordingly:
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
