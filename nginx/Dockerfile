FROM nginx:stable-alpine

RUN apk update && apk add vim openssl apache2-utils

ENV NGINX_METRICS_USER=rallyu-prom
ENV NGINX_METRICS_PASSWORD=yourpassword

COPY ./scripts/entrypoint.sh /entrypoint.sh
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["sh", "/entrypoint.sh"]
