FROM nginx:stable-alpine

RUN apk update && apk add apache2-utils

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./script.sh /script.sh

RUN chmod +x /script.sh

ENTRYPOINT ["sh", "/script.sh"]