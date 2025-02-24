FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./index.html .
COPY ./logo.png .
COPY ./src ./src

COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 8083

CMD ["nginx", "-g", "daemon off;"]
