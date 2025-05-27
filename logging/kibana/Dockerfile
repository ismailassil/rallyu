ARG ELK_VERSION

FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

COPY ./scripts/entrypoint.sh /scripts/entrypoint.sh

ENTRYPOINT [ "/bin/sh", "/scripts/entrypoint.sh" ]