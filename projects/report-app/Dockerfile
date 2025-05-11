# Étape de build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --project=report-app --configuration=production

# Étape de runtime
FROM nginx:alpine
COPY --from=build /app/dist/report-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
