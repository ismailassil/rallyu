ARG ELK_VERSION

FROM docker.elastic.co/kibana/kibana:${ELK_VERSION}

USER root

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY ./scripts/entrypoint.sh /scripts/entrypoint.sh

USER kibana

ENTRYPOINT [ "/bin/sh", "/scripts/entrypoint.sh" ]