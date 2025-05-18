FROM docker.elastic.co/elasticsearch/elasticsearch:${ELK_VERSION}

USER root

COPY ./conf/instances.yml /conf/instances.yml

COPY ./scripts/lib.sh lib.sh
COPY ./scripts/script.sh script.sh

RUN chmod +x script.sh lib.sh

ENTRYPOINT [ "sh", "-c", "source /lib.sh && /script.sh" ]
