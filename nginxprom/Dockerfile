FROM nginx:stable-alpine

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]