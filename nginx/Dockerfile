FROM nginx:stable-alpine

RUN apk update && apk add vim openssl apache2-utils

COPY ./scripts/entrypoint.sh /entrypoint.sh
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["sh", "/entrypoint.sh"]
