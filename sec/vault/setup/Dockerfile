FROM alpine:3.22.0

RUN apk update && apk upgrade && apk add jq curl

COPY ./scripts/entrypoint.sh /sh.sh

RUN chmod +x /sh.sh

ENTRYPOINT [ "/sh.sh" ]
