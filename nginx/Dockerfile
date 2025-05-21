FROM nginx:stable-alpine

# Should be removed
COPY index.html /usr/share/nginx/html

# COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

RUN apk update && apk add vim openssl

RUN mkdir -p /certs/web-app/private /certs/kibana/private

RUN openssl req -x509 -newkey rsa:4096 \
	-out /certs/web-app/cert.pem -sha256 \
	-keyout /certs/web-app/private/key.pem \
	-days 365 -nodes -subj "/C=MA/ST=KH/L=KH/O=1337/OU=dev/CN=localhost"

RUN openssl req -x509 -newkey rsa:4096 \
	-out /certs/kibana/cert.pem -sha256 \
	-keyout /certs/kibana/private/key.pem \
	-days 365 -nodes -subj "/C=MA/ST=KH/L=KH/O=1337/OU=dev/CN=localhost"

ENTRYPOINT ["nginx", "-g", "daemon off;"]

## docker run --name nginx -d -p 80:80 -p 443:443 -p 9000:9000 \
## -v /Volumes/MiniDisk/work/rallyu/devops/nginx/logs/access.log:/var/log/nginx/access.log \
## -v /Volumes/MiniDisk/work/rallyu/devops/nginx/conf/global.conf:/etc/nginx/conf.d/default.conf \
## ngx
