FROM docker.elastic.co/elasticsearch/elasticsearch:9.0.1

USER root

COPY ./conf/instances.yml /conf/instances.yml

COPY ./scripts/lib.sh lib.sh
COPY ./scripts/script.sh script.sh
COPY ./scripts/entrypoint.sh entrypoint.sh

RUN chmod +x script.sh lib.sh entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
