FROM nginx:stable-alpine

RUN apk update && apk add vim openssl

ENTRYPOINT ["sh", "/entrypoint.sh"]

## docker run --name nginx -d -p 80:80 -p 443:443 -p 9000:9000 \
## -v /Volumes/MiniDisk/work/rallyu/devops/nginx/logs/access.log:/var/log/nginx/access.log \
## -v /Volumes/MiniDisk/work/rallyu/devops/nginx/conf/global.conf:/etc/nginx/conf.d/default.conf \
## ngx
